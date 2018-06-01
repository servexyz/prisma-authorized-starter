module.exports = {
  webpack: (config, options, webpack) => {
    // Perform customizations to config
    // Important: return the modified config
    config.resolve.symlinks = false;
    config.plugins.push(new webpack.IgnorePlugin(/^electron$/));
    return config;
  }
};
