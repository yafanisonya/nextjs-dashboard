import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    // 打印环境变量（注意不要在生产环境这样做）
    console.log('Database URL:', process.env.POSTGRES_URL);
    
    // 测试最基本的查询
    const result = await sql`
      SELECT current_timestamp;
    `;
    
    return Response.json({
      status: 'success',
      timestamp: result.rows[0],
      connection: 'successful'
    });
  } catch (error: unknown) {
    console.error('连接错误详情:', {
      message: error instanceof Error ? error.message : String(error),
      code: error instanceof Error && 'code' in error ? (error as any).code : undefined,
      stack: error instanceof Error ? error.stack : undefined
    });
    return Response.json({
      status: 'error',
      message: error instanceof Error ? error.message : String(error),
      details: {
        code: error instanceof Error && 'code' in error ? (error as any).code : undefined,
        // 仅在开发环境显示完整错误
        stack: error instanceof Error ? (process.env.NODE_ENV === 'development' ? error.stack : undefined) : undefined
      }
    }, { status: 500 });
  }
}