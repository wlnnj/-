import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('Starting application bootstrap... (Security Hardened)');
  const app = await NestFactory.create(AppModule);

  // 安全响应头 (Helmet) - 允许跨域资源加载
  app.use(helmet({
    contentSecurityPolicy: false, // 允许内联脚本 (前端 SPA 需要)
    crossOriginEmbedderPolicy: false, // 允许跨域嵌入
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // 允许跨域资源请求
  }));

  // API 前缀
  app.setGlobalPrefix('api');

  // CORS 配置
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // 全局验证管道
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // 全局序列化拦截器 (自动应用 @Exclude 等装饰器)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(` 后端服务已启动: http://localhost:${port}/api`);
}
bootstrap();

