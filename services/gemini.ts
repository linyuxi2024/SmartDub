import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const optimizeScript = async (
  currentScript: string,
  targetDuration: number,
  currentDuration: number,
  mode: 'shorten' | 'extend'
): Promise<string> => {
  
  const action = mode === 'shorten' ? 'condense' : 'expand';

  // Translate instructions to Chinese to align with the new app language
  const prompt = `
    你是一位专业的视频脚本编辑。
    用户有一个 ${Math.round(targetDuration)} 秒的视频。
    当前的脚本预计阅读时间为 ${Math.round(currentDuration)} 秒。
    
    你的任务是${mode === 'shorten' ? '缩短' : '扩写'}脚本，使其更符合视频时长。
    目标时长：约 ${Math.round(targetDuration)} 秒。
    
    规则：
    1. 保持原有的语气和关键信息。
    2. 只输出重写后的脚本内容，不要添加任何解释。
    3. 输出语言必须与输入语言保持一致。
    
    原始脚本：
    """
    ${currentScript}
    """
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      }
    });

    const text = response.text;
    
    if (!text) {
      throw new Error("No text returned from Gemini API. The response might have been empty or blocked.");
    }

    return text.trim();
  } catch (error) {
    console.error("Gemini optimization failed:", error);
    throw error;
  }
};