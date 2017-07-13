module.exports = class CallCredential {
  constructor(plugin) {
    if (!plugin) {
      throw new TypeError('CallCredentials can only be created with the provided functions');
    }
    this.plugin = plugin;
  }

  compose() {
    console.log(this, arguments);
  }

  static createFromPlugin(plugin) {
    return new CallCredential(plugin);
  }
}