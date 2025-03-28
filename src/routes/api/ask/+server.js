import { json } from '@sveltejs/kit';
import { getGithubContents } from '$lib/server/github.js';
import { generateResponse } from '$lib/server/gemma.js';

export async function POST({ request }) {
  try {
    const { query } = await request.json();
    
    // GitHubからコンテンツを取得
    const githubData = await getGithubContents();
    
    // Gemma APIを使って回答を生成
    const result = await generateResponse(query, githubData);
    
    return json({ result });
  } catch (error) {
    console.error('Error processing request:', error);
    return json({ error: 'リクエスト処理中にエラーが発生しました' }, { status: 500 });
  }
}