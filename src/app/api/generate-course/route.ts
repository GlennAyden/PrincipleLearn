// src/app/api/generate-course/route.ts
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import prisma from '@/lib/prisma';

// 1. Ambil API key dari env
let apiKey = process.env.OPENAI_API_KEY;
// 2. Fallback ke admin key kalau perlu
if (!apiKey || apiKey.startsWith('sk-proj-')) {
  console.warn(
    'Env key invalid or missing, falling back to hardcoded admin key for testing'
  );
  apiKey = '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';
}

const openai = new OpenAI({ apiKey });

export async function POST(req: Request) {
  console.log('[Generate Course] Starting course generation process');
  try {
    // 3. Terima payload
    const { topic, goal, level, extraTopics, problem, assumption, userId } =
      await req.json();
      
    console.log(`[Generate Course] Received request for topic: "${topic}" from user: ${userId || 'anonymous'}`);

    // 4. Prompt yang lebih komprehensif
    const systemMessage = {
      role: 'system',
      content: `You are an expert educational content developer specialized in creating detailed, comprehensive, and structured learning plans. 
Your expertise lies in breaking down complex topics into logical modules with clear, informative subtopics that build upon each other.
You create content that is appropriate for the user's skill level, connects to real-world problems, and addresses common misconceptions.`
    };
    
    const userMessage = {
      role: 'user',
      content: `
Buatkan outline pembelajaran komprehensif untuk topik "${topic}" dengan tujuan "${goal}".

## TINGKAT PENGETAHUAN PENGGUNA
Level: ${level}

## INFORMASI TAMBAHAN
Topik spesifik yang ingin dipelajari: ${extraTopics || "Tidak ada preferensi khusus."}
Masalah nyata yang ingin dipecahkan: ${problem}
Asumsi awal pengguna: ${assumption}

## PANDUAN PEMBUATAN KONTEN
1. Buat minimal 4-6 modul utama yang membangun pengetahuan secara bertahap
2. Untuk setiap modul, buat 4-8 subtopik yang saling berkaitan
3. Setiap subtopik harus memiliki:
   - Judul yang jelas dan deskriptif
   - Overview komprehensif (3-5 kalimat) yang menjelaskan:
     * Apa yang akan dipelajari
     * Mengapa ini penting
     * Bagaimana kaitannya dengan subtopik lain atau tujuan keseluruhan
4. Pastikan konten sesuai dengan:
   - Level pengetahuan pengguna (${level})
   - Masalah nyata yang ingin dipecahkan
   - Tujuan pembelajaran yang diinginkan

## FORMAT OUTPUT
Output harus berupa MURNI JSON array tanpa blok kode Markdown, dengan format:
[
  {
    "module": "1. Judul Modul Lengkap", 
    "subtopics": [
      {
        "title": "1.1 Judul Subtopik yang Deskriptif",
        "overview": "Overview yang informatif berisi 3-5 kalimat yang menjelaskan konsep utama, tujuan pembelajaran, dan relevansinya. Tambahkan contoh penerapan jika relevan. Jelaskan mengapa bagian ini penting untuk dikuasai dan bagaimana kaitannya dengan subtopik lain."
      },
      ...
    ]
  },
  ...
]
      `
    };

    console.log('[Generate Course] Calling OpenAI API');
    
    // 5. Panggil OpenAI dengan instruksi sistem + pengguna
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [systemMessage, userMessage] as any,
      temperature: 0.7, // Sedikit variasi untuk kreativitas
      max_tokens: 4000, // Meningkatkan jumlah token maksimum untuk respons yang lebih panjang
    });

    console.log('[Generate Course] Received response from OpenAI');
    
    // 6. Ambil dan bersihkan output
    const textRaw = response.choices[0].message?.content ?? '[]';
    const cleaned = textRaw
      .replace(/```json\s*/g, '')
      .replace(/```/g, '')
      .trim();

    // 7. Parse JSON
    let outline;
    try {
      outline = JSON.parse(cleaned);
      console.log(`[Generate Course] Successfully parsed JSON with ${outline.length} modules`);
    } catch (parseErr: any) {
      console.error('[Generate Course] Failed to parse JSON:', { cleaned, parseErr });
      throw new Error('Invalid JSON response from AI');
    }
    
    // 8. Jika ada userId, catat aktivitas generate course
    if (userId) {
      console.log(`[Generate Course] Attempting to log activity for user: ${userId}`);
      try {
        // Temukan user berdasarkan email
        const user = await prisma.user.findUnique({
          where: { email: userId }
        });

        if (!user) {
          console.warn(`[Generate Course] User with email ${userId} not found`);
        } else {
          console.log(`[Generate Course] Found user with ID: ${user.id}`);
          
          // Log lengkap parameter untuk referensi di admin panel
          const parameter = JSON.stringify({
            topic, goal, level, extraTopics, problem, assumption
          });
          
          // Simpan log generasi course ke database
          console.log('[Generate Course] Saving activity log to database');
          const logResult = await prisma.generateCourse.create({
            data: {
              userId: user.id,
              courseName: topic,
              parameter,
            }
          });
          
          console.log('[Generate Course] Activity logged successfully, ID:', logResult.id);
          
          // Double-check that the record was created
          const verifyLog = await prisma.generateCourse.findUnique({
            where: { id: logResult.id }
          });
          
          if (verifyLog) {
            console.log('[Generate Course] Verified record exists in database');
          } else {
            console.warn('[Generate Course] Record verification failed - record may not have been saved');
          }
        }
      } catch (dbError: any) {
        console.error('[Generate Course] Error logging activity:', dbError);
        console.error('[Generate Course] Error details:', dbError.message);
        console.error('[Generate Course] Error stack:', dbError.stack);
        // Lanjutkan meskipun gagal menyimpan log
      }
    } else {
      console.warn('[Generate Course] No userId provided, activity not logged');
    }

    // 9. Kirim balik outline
    console.log('[Generate Course] Returning outline to client');
    return NextResponse.json({ outline });
  } catch (err: any) {
    console.error('[Generate Course] Error generating course outline:', err);
    console.error('[Generate Course] Error details:', err.message);
    console.error('[Generate Course] Error stack:', err.stack);
    return NextResponse.json(
      { error: err.message || 'Failed to generate outline' },
      { status: 500 }
    );
  }
}
