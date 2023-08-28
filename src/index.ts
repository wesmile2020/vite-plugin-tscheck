import { Plugin } from 'rollup';
import { createFilter, FilterPattern } from '@rollup/pluginutils';
import { Engine } from './Engine';

interface Options {
  cwd?: string;
  include?: FilterPattern;
  exclude?: FilterPattern;
  check?: boolean;
}

const defaultOptions: Options = {
  include: ['*.ts+(|x)', '**/*.ts+(|x)'],
  exclude: ['node_modules'],
  check: true,
};

function tsCheck(options?: Options): Plugin {
  const opts = { ...defaultOptions, ...options };
  const cwd = opts.cwd || process.cwd();
  const engine = new Engine(cwd);
  const filter = createFilter(opts.include, opts.exclude);

  return {
    name: 'vite-plugin-tscheck',

    transform: {
      order: 'pre',
      handler (code, id) {
        if (!filter(id) || !opts.check) {
          return code;
        }

        const flag = engine.check(id, code);
        if (!flag) {
          this.error(`vite-plugin-tscheck: ${id} valid failed`);
        }
        return code;
      },
    },
  };
}

export { tsCheck }
export default tsCheck;
