import { sql } from '@vercel/postgres';
import { headers } from 'next/headers';

export async function GET() {
  try {
    // 解析数据库 URL（移除敏感信息）
    const dbUrl = new URL(process.env.POSTGRES_URL || '');
    const sanitizedDbInfo = {
      host: dbUrl.hostname,
      port: dbUrl.port,
      database: dbUrl.pathname.replace('/', ''),
      username: dbUrl.username,
      // 不显示实际密码
      hasPassword: !!dbUrl.password
    };

    console.log('Database connection info:', sanitizedDbInfo);

    // 测试连接
    const testResult = await sql`
      SELECT current_database() as database_name, 
             current_user as username,
             version() as version;
    `;

    return Response.json({
      status: 'success',
      connectionInfo: sanitizedDbInfo,
      databaseInfo: testResult.rows[0]
    });
  } catch (error: unknown) {
    console.error('Detailed connection error:', {
      name: (error as Error).name,
      message: (error as Error).message,
      code: (error as {code?: string}).code
    });

    return Response.json({
      status: 'error',
      connectionInfo: {
        error: (error as Error).message,
        type: (error as Error).name,
        code: (error as {code?: string}).code
      },
      troubleshooting: {
        checkPoints: [
          'Verify database is active in Vercel dashboard',
          'Check if IP is allowed in database firewall rules',
          'Ensure connection string format is correct',
          'Database name exists in the connection string'
        ]
      }
    }, { status: 500 });
  }
}