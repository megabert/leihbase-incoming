import {
  defineNuxtModule,
  addImports,
  addPlugin,
  createResolver,
} from "@nuxt/kit";

export default defineNuxtModule({
  meta: {
    // Usually the npm package name of your module
    name: "pocketbase",
    // The key in `nuxt.config` that holds your module options
    configKey: "pocketbase",
    // Compatibility constraints
    // compatibility: {
    // Semver version of supported nuxt versions
    //   nuxt: '^3.0.0'
    // }
  },
  // Default configuration options for your module, can also be a function returning those
  defaults: {
    serverBaseUrl: "http://localhost:8080",
    clientBaseUrl: "http://localhost:8080",
  },
  // Shorthand sugar to register Nuxt hooks
  hooks: {},
  // The function holding your module logic, it can be asynchronous
  setup(moduleOptions, nuxt) {
    const resolver = createResolver(import.meta.url);

    nuxt.options.runtimeConfig.public.pocketbase = {
      serverBaseUrl: moduleOptions.serverBaseUrl,
      clientBaseUrl: moduleOptions.clientBaseUrl,
      ...(nuxt.options.runtimeConfig?.public?.pocketbase || {}),
    };

    addPlugin(resolver.resolve("plugins/pocketbase"));

    addImports({
      name: "usePocketbase", // name of the composable to be used
      as: "usePocketbase",
      from: resolver.resolve("composables/usePocketbase"), // path of composable
    });
  },
});
