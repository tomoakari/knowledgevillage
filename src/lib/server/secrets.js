import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// キャッシュされたシークレット
let cachedSecrets = null;
let cacheExpiration = null;
const CACHE_TTL = 3600000; // 1時間のキャッシュ

export async function getSecrets() {
  // キャッシュが有効な場合は、キャッシュから返す
  if (cachedSecrets && cacheExpiration && Date.now() < cacheExpiration) {
    return cachedSecrets;
  }

  try {
    // Secret Managerクライアントの初期化
    const client = new SecretManagerServiceClient();
    
    // プロジェクトID
    // 注: Cloud Runでは、自動的にプロジェクトIDが環境変数として設定される
    const projectId = process.env.GOOGLE_CLOUD_PROJECT;
    
    if (!projectId) {
      throw new Error('プロジェクトIDが設定されていません');
    }

    // シークレットの取得
    const [githubTokenVersion] = await client.accessSecretVersion({
      name: `projects/${projectId}/secrets/GITHUB_TOKEN/versions/latest`
    });

    const [gemmaApiKeyVersion] = await client.accessSecretVersion({
      name: `projects/${projectId}/secrets/GEMMA_API_KEY/versions/latest`
    });

    // シークレット値をデコード
    const githubToken = githubTokenVersion.payload.data.toString();
    const gemmaApiKey = gemmaApiKeyVersion.payload.data.toString();

    // キャッシュに格納
    cachedSecrets = {
      GITHUB_TOKEN: githubToken,
      GEMMA_API_KEY: gemmaApiKey
    };
    
    cacheExpiration = Date.now() + CACHE_TTL;
    
    return cachedSecrets;
  } catch (error) {
    console.error('Error fetching secrets:', error);
    throw new Error('Secret Managerからシークレットの取得に失敗しました');
  }
}