import { sql } from '@vercel/postgres';

export async function GET() {
  // 在函数开始就声明变量
  let envVars;
  let urlPreview;

  try {
    // 检查环境变量是否存在
    envVars = {
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
      POSTGRES_URL_NON_POOLING: !!process.env.POSTGRES_URL_NON_POOLING,
      POSTGRES_USER: !!process.env.POSTGRES_USER,
      POSTGRES_HOST: !!process.env.POSTGRES_HOST,
      POSTGRES_PASSWORD: !!process.env.POSTGRES_PASSWORD,
      POSTGRES_DATABASE: !!process.env.POSTGRES_DATABASE,
    };

    // 打印连接字符串的前10个字符（安全考虑）
    urlPreview = process.env.POSTGRES_URL 
      ? `${process.env.POSTGRES_URL.substring(0, 10)}...` 
      : 'not found';

    console.log('Environment check:', envVars);
    console.log('URL preview:', urlPreview);

    // 尝试基本连接
    const result = await sql`SELECT version();`;

    return Response.json({
      status: 'success',
      environmentCheck: envVars,
      urlPreview,
      postgresVersion: result.rows[0].version
    });
  } catch (error: any) {
    console.error('Connection error details:', {
      name: error.name,
      message: error.message, 
      code: error.code,
      env: envVars // 现在可以安全访问
    });

    return Response.json({
      status: 'error',
      environmentCheck: envVars,
      urlPreview,
      error: {
        name: error.name,
        message: error.message,
        code: error.code
      }
    }, { status: 500 });
  }
}