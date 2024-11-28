import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    // 1. 检查数据库连接
    console.log('测试数据库连接...');
    await sql`SELECT 1`;
    console.log('数据库连接成功');

    // 2. 列出所有表
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    console.log('现有表:', tables.rows);

    // 3. 检查 revenue 表数据
    const revenueCount = await sql`
      SELECT COUNT(*) FROM revenue;
    `;
    console.log('revenue 表记录数:', revenueCount.rows[0].count);

    // 4. 查看 revenue 表的实际数据
    const revenueData = await sql`
      SELECT * FROM revenue LIMIT 5;
    `;
    console.log('revenue 表示例数据:', revenueData.rows);

    return Response.json({
      status: 'success',
      tables: tables.rows,
      revenueCount: revenueCount.rows[0].count,
      revenueData: revenueData.rows
    });
  } catch (error) {
    console.error('数据库检查错误:', error);
    return Response.json({ 
      status: 'error',
      error: (error as Error).message,
      stack: (error as Error).stack 
    }, { status: 500 });
  }
}