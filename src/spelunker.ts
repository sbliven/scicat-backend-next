import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SpelunkerModule } from 'nestjs-spelunker';
import { AppModule } from 'src/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1. Generate the tree as text
  const tree = SpelunkerModule.explore(app, {
    // A list of regexes or predicate functions to apply over modules that will be ignored
    ignoreImports: [
      /^MongooseCore/,
      /EventEmitter/,
      // /Config/,
      // (moduleName) => !/App|Casl|Common|Mail|Job/.test(moduleName)
    ],
  });
  const root = SpelunkerModule.graph(tree);
  const edges = SpelunkerModule.findGraphEdges(root);
  const mermaidEdges = edges
    .map(({ from, to }) => `${from.module.name}-->${to.module.name}`);
  console.log(`graph LR\n  ${mermaidEdges.join('\n  ')}`);

  // 2. Copy and paste the log content in "https://mermaid.live/"
}

bootstrap();