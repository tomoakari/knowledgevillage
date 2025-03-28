import { getSecrets } from './secrets.js';

export async function generateResponse(query, githubData) {
  try {
    // Secret Managerから認証情報を取得
    const secrets = await getSecrets();
    const gemmaApiKey = secrets.GEMMA_API_KEY;
    
    // Gemma APIのエンドポイント
    const apiUrl = 'https://generativelanguage.googleapis.com/v1/models/gemma-3:generateContent';
    
    // プロンプトの作成
    const prompt = `
あなたはGitHubリポジトリの内容に基づいて質問に答えるアシスタントです。
以下のGitHubリポジトリの情報を参考にして、質問に対する回答を提供してください。

質問: ${query}

GitHubリポジトリの情報:
${githubData}

上記の情報をもとに、質問に対して簡潔かつ正確に回答してください。リポジトリの情報に基づいていない推測は避けてください。情報が不足している場合は、その旨を伝えてください。
`;

    // Gemma API呼び出しのためのリクエスト
    const response = await fetch(`${apiUrl}?key=${gemmaApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generation_config: {
          temperature: 0.2,
          max_output_tokens: 1024
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemma API error:', errorData);
      throw new Error('Gemma APIからのレスポンスに問題がありました');
    }

    const data = await response.json();
    
    // Gemma3からのレスポンスを抽出
    if (data.candidates && data.candidates.length > 0 && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Gemma APIから適切な応答が得られませんでした');
    }
  } catch (error) {
    console.error('Error generating response with Gemma:', error);
    throw new Error('Gemmaを使った回答生成に失敗しました');
  }
}