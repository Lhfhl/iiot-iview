module.exports = {
  root: true,
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    'no-undef': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  overrides: [
    {
      files: ['src/view/**/*.js', 'src/view/**/*.vue'], // 针对 src/view 下的文件
      rules: {
        // 仅禁用代码风格相关的规则
        'comma-dangle': 'off',       // 关闭对象或数组最后一个元素后必须加逗号的检查
        'semi': 'off',               // 关闭分号检查
        'quotes': 'off',             // 关闭引号检查（单双引号混用）
        'space-before-function-paren': 'off', // 关闭函数括号前的空格检查
      }
    }
  ]
}
