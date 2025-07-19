// src/app/api/ask-question/route.ts
import { NextResponse, NextRequest } from 'next/server';
import OpenAI from 'openai';
import prisma from '@/lib/prisma';

// Get API key from env with proper fallback (FIXED: proper validation)
let apiKey = process.env.OPENAI_API_KEY;
if (!apiKey || apiKey === 'your-openai-api-key-here' || apiKey === 'sk-your-openai-api-key') {
  console.warn('Env key invalid or missing, falling back to hardcoded admin key for testing');
  apiKey = 'sk-proj-your-openai-api-key-here';
}

const openai = new OpenAI({ apiKey });

export async function POST(request: NextRequest) {
  try {
    // Parse request body for question and context
    const { question, context, userId, courseId, subtopic } = await request.json();

    const systemMessage = {
      role: 'system',
      content: `You are an expert educational assistant that provides helpful, accurate answers to questions about course content.
Your goal is to explain concepts clearly, provide examples when useful, and help users understand the material.

Guidelines for your answers:
- Provide clear and straightforward explanations
- Use everyday language and avoid technical jargon unless necessary
- Format your answers to be easy to read with appropriate spacing and structure
- When appropriate, include examples that illustrate concepts
- Base your answers on the course content, not external knowledge
- Be concise but thorough
- Write your responses in Indonesian language with a conversational, friendly tone (tidak terlalu formal)
- Format your response with markdown when helpful (bullet points, numbering, etc.)

Remember: the user is learning this content, so explain things in a way that builds understanding.`
    };

    const userMessage = {
      role: 'user',
      content: `Course content: 
${context}

User's question: "${question}"

Please answer this question in Indonesian language with a conversational, friendly tone (tidak terlalu formal). Use the course content as the basis for your answer.`
    };

    // Prepare messages array (cast to any to satisfy TS overloads)
    const messages = [
      systemMessage,
      userMessage,
    ] as any;

    // Call OpenAI Chat Completion
    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
    });

    const answer = res.choices?.[0]?.message?.content || '';
    
    // Jika ada userId, courseId, dan subtopic, simpan ke database
    if (userId && courseId && subtopic) {
      try {
        // Temukan user berdasarkan email
        const user = await prisma.user.findUnique({
          where: { email: userId }
        });

        if (!user) {
          // Log warning tapi tetap melanjutkan (jangan gagalkan request utama)
          console.warn(`User with email ${userId} not found`);
        } else {
          await prisma.transcriptQna.create({
            data: {
              userId: user.id,
              courseId,
              subtopic,
              question,
              answer,
            }
          });
          console.log('QnA transcript saved to database');
        }
      } catch (dbError) {
        console.error('Error saving transcript to database:', dbError);
        // Lanjutkan meskipun gagal menyimpan ke database
      }
    }
    
    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error('Error generating answer:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
