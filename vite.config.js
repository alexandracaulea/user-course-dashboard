import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src', // Add alias to simplify path references
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src/data/users.json',
          dest: 'data',
        },
        {
          src: 'src/data/courses.json',
          dest: 'data',
        },
        {
          src: 'home.html',
          dest: '',
        },
        {
          src: 'user.html',
          dest: '',
        },
        {
          src: 'course.html',
          dest: '',
        },
      ],
    }),
  ],
});
