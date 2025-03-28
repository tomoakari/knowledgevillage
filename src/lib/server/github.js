import { Octokit } from '@octokit/rest';
import { getSecrets } from './secrets.js';

export async function getGithubContents() {
  try {
    // Secret Managerから認証情報を取得
    const secrets = await getSecrets();
    const githubToken = secrets.GITHUB_TOKEN;

    // Octokitのセットアップ
    const octokit = new Octokit({
      auth: githubToken
    });

    // リポジトリ情報の取得
    const owner = 'tomoakari';
    const repo = 'punihoppe';
    
    // リポジトリのファイル一覧を取得
    const result = await octokit.repos.getContent({
      owner,
      repo,
      path: ''
    });

    // コンテンツを収集
    let allContent = '';
    
    // ファイルを処理
    for (const item of result.data) {
      if (item.type === 'file' && 
          (item.name.endsWith('.md') || 
           item.name.endsWith('.txt') ||
           item.name.endsWith('.js') ||
           item.name.endsWith('.py') ||
           item.name.endsWith('.html') ||
           item.name.endsWith('.css'))) {
        try {
          const fileContent = await octokit.repos.getContent({
            owner,
            repo,
            path: item.path
          });
          
          // Base64でエンコードされたコンテンツをデコード
          const content = Buffer.from(fileContent.data.content, 'base64').toString();
          allContent += `\n\nFILE: ${item.path}\n${content}`;
        } catch (error) {
          console.error(`Error fetching content for ${item.path}:`, error);
        }
      }
    }
    
    // README.mdを最優先で取得（存在する場合）
    try {
      const readmeContent = await octokit.repos.getContent({
        owner,
        repo,
        path: 'README.md'
      });
      
      if (readmeContent.data) {
        const readme = Buffer.from(readmeContent.data.content, 'base64').toString();
        // READMEを先頭に配置
        allContent = `README.md:\n${readme}\n${allContent}`;
      }
    } catch (error) {
      // READMEが存在しない場合はスキップ
      console.log('No README found, continuing...');
    }
    
    // リポジトリの基本情報を取得
    const repoInfo = await octokit.repos.get({
      owner,
      repo
    });
    
    // リポジトリの基本情報を追加
    const repoMetadata = `
リポジトリ名: ${repoInfo.data.name}
説明: ${repoInfo.data.description || 'なし'}
言語: ${repoInfo.data.language || 'なし'}
作成日: ${repoInfo.data.created_at}
最終更新: ${repoInfo.data.updated_at}
Stars: ${repoInfo.data.stargazers_count}
Forks: ${repoInfo.data.forks_count}
`;
    
    // 完全なデータを返す
    return `${repoMetadata}\n${allContent}`;
    
  } catch (error) {
    console.error('Error fetching GitHub contents:', error);
    throw new Error('GitHubコンテンツの取得に失敗しました');
  }
}