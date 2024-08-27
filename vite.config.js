import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: ['src/data/users.json', 'src/data/courses.json'],
          dest: '',
        },
      ],
    }),
  ],
});
