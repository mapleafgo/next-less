import {
  Configuration,
  RuleSetConditionAbsolute,
  RuleSetRule,
  RuleSetUseItem,
} from "webpack";

function getLessTest(test: RuleSetConditionAbsolute): RuleSetConditionAbsolute {
  const testStr = `${test}`.replace(".(scss|sass)", ".less");
  return RegExp(testStr.slice(1, testStr.length - 1));
}

function getLessUse(use: any, lessOptions): RuleSetUseItem {
  if (`${use.loader}`.includes("sass-loader")) {
    const { implementation: _, sassOptions: __, ...useOptions } = use.options;
    return {
      loader: require.resolve("less-loader"),
      options: {
        ...useOptions,
        lessOptions: Object.assign({ javascriptEnabled: true }, lessOptions),
      },
    };
  }
  return use;
}

module.exports = (lessOptions: any = {}, nextConfig: any = {}) => {
  return Object.assign({}, nextConfig, {
    webpack: (config: Configuration, options) => {
      if (!options.defaultLoaders) {
        throw new Error(
          "This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade"
        );
      }

      if (config.module == undefined || config.module.rules == undefined) {
        return config;
      }
      const { rules } = config.module;

      const ruleIndex = rules.findIndex((rule) => rule.hasOwnProperty("oneOf"));
      if (ruleIndex == -1) {
        return config;
      }

      const rule = rules[ruleIndex] as RuleSetRule;
      if (rule.oneOf == undefined || rule.oneOf.length == 0) {
        return config;
      }

      const sassRules = rule.oneOf.filter((item) => {
        if (Array.isArray(item.test)) {
          return item.test.some((test) => `${test}`.endsWith(".(scss|sass)$/"));
        } else {
          return `${item.test}`.endsWith(".(scss|sass)$/");
        }
      });

      const lessRules = (Object.create(sassRules) as RuleSetRule[]).map(
        (item) => {
          if (item.test) {
            item.test = Array.isArray(item.test)
              ? item.test.map((test) => getLessTest(test))
              : getLessTest(item.test);

            item.use = Array.isArray(item.use)
              ? item.use.map((use) => getLessUse(use, lessOptions))
              : getLessUse(item.use, lessOptions);
          }
          return item;
        }
      );

      rule.oneOf.push(...lessRules);
      config.module.rules.splice(ruleIndex, 1, rule);

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};
