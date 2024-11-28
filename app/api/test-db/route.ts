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
  } catch (error) {
    console.error('连接错误详情:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    return Response.json({
      status: 'error',
      message: error.message,
      details: {
        code: error.code,
        // 仅在开发环境显示完整错误
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}