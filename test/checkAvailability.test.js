"use strict";

const path = require('path');

const test = require('./_base')(module);


test['no clients'] = function*() {
  let mgr = new this.Manager({
    "clients": {} 
  });
  
  // mgr.logger = console;
  yield mgr.init();
  
  mgr.clients.length.should.eql(0);
};


test['client not supported on architecture'] = function*() {
  const platforms = this.buildPlatformConfig(process.platform, 'invalid', {
    "url": "http://badgerbadgerbadger.com",
    "bin": "maga"    
  });
  
  let mgr = new this.Manager({
    clients: {
      "Maga": {
        "homepage": "http://badgerbadgerbadger.com",
        "version": "1.0.0",
        "foo": "bar",
        "versionNotes": "http://badgerbadgerbadger.com",
        "cli": {
          "commands": {
            "sanityCheck": {
              "args": ['test'],
              "output": [ "good:test" ]
            }
          },                  
          "platforms": platforms,
        }
      }
    }
  });
  
  // mgr.logger = console;
  yield mgr.init();
  
  mgr.clients.length.should.eql(0);
};



test['client not supported on platform'] = function*() {
  const platforms = this.buildPlatformConfig('invalid', process.arch, {
    "url": "http://badgerbadgerbadger.com",
    "bin": "maga"    
  });
  
  let mgr = new this.Manager({
    clients: {
      "Maga": {
        "homepage": "http://badgerbadgerbadger.com",
        "version": "1.0.0",
        "foo": "bar",
        "versionNotes": "http://badgerbadgerbadger.com",
        "cli": {
          "commands": {
            "sanityCheck": {
              "args": ['test'],
              "output": [ "good:test" ]
            }
          },                  
          "platforms": platforms,
        }
      }
    }
  });
  
  // mgr.logger = console;
  yield mgr.init();
  
  mgr.clients.length.should.eql(0);
};



test['unable to resolve binary'] = function*() {
  const platforms = this.buildPlatformConfig(process.platform, process.arch, {
    "url": "http://badgerbadgerbadger.com",
    "bin": "invalid"    
  });
  
  let mgr = new this.Manager({
    clients: {
      "Maga": {
        "homepage": "http://badgerbadgerbadger.com",
        "version": "1.0.0",
        "foo": "bar",
        "versionNotes": "http://badgerbadgerbadger.com",
        "cli": {
          "commands": {
            "sanityCheck": {
              "args": ['test'],
              "output": [ "good:test" ]
            }
          },                  
          "platforms": platforms,
        }
      }
    }
  });
  
  // mgr.logger = console;
  yield mgr.init();
  
  mgr.clients.length.should.eql(1);
  
  const client = mgr.clients.pop();
  
  client.state.available.should.be.false;
  client.state.failReason.should.eql('notFound');
};



test['sanity check failed'] = function*() {
  const platforms = this.buildPlatformConfig(process.platform, process.arch, {
    "url": "http://badgerbadgerbadger.com",
    "bin": "maga"    
  });
  
  let mgr = new this.Manager({
    clients: {
      "Maga": {
        "homepage": "http://badgerbadgerbadger.com",
        "version": "1.0.0",
        "foo": "bar",
        "versionNotes": "http://badgerbadgerbadger.com",
        "cli": {
          "commands": {
            "sanityCheck": {
              "args": ['test'],
              "output": [ "invalid" ]
            }
          },                  
          "platforms": platforms,
        }
      }
    }
  });
  
  // mgr.logger = console;
  yield mgr.init();
  
  mgr.clients.length.should.eql(1);
  
  const client = mgr.clients.pop();
  
  client.state.available.should.be.false;
  client.state.failReason.should.eql('sanityCheckFail');
};


test['sanity check passed'] = function*() {
  const platforms = this.buildPlatformConfig(process.platform, process.arch, {
    "url": "http://badgerbadgerbadger.com",
    "bin": "maga"    
  });
  
  let mgr = new this.Manager({
    clients: {
      "Maga": {
        "homepage": "http://badgerbadgerbadger.com",
        "version": "1.0.0",
        "foo": "bar",
        "versionNotes": "http://badgerbadgerbadger.com",
        "cli": {
          "commands": {
            "sanityCheck": {
              "args": ['test'],
              "output": [ "good:test" ]
            }
          },                  
          "platforms": platforms,
        }
      }
    }
  });
  
  // mgr.logger = console;
  yield mgr.init();
  
  mgr.clients.length.should.eql(1);
  
  const client = mgr.clients.pop();
  
  client.state.available.should.be.true;
};



test['sanity check is mandatory'] = function*() {
  const platforms = this.buildPlatformConfig(process.platform, process.arch, {
    "url": "http://badgerbadgerbadger.com",
    "bin": "maga"    
  });
  
  let mgr = new this.Manager({
    clients: {
      "Maga": {
        "homepage": "http://badgerbadgerbadger.com",
        "version": "1.0.0",
        "foo": "bar",
        "versionNotes": "http://badgerbadgerbadger.com",
        "cli": {
          "platforms": platforms,
        }
      }
    }
  });
  
  // mgr.logger = console;
  yield mgr.init();
  
  mgr.clients.length.should.eql(1);
  
  const client = mgr.clients.pop();
  
  client.state.available.should.be.false;
  client.state.failReason.should.eql('sanityCheckFail');
};



test['client config returned'] = function*() {
  const platforms = this.buildPlatformConfig(process.platform, process.arch, {
    "url": "http://badgerbadgerbadger.com",
    "bin": "maga"    
  });
  
  const config = {
    clients: {
      "Maga": {
        "homepage": "http://badgerbadgerbadger.com",
        "version": "1.0.0",
        "foo": "bar",
        "versionNotes": "http://badgerbadgerbadger.com",
        "cli": {
          "commands": {
            "sanityCheck": {
              "args": ['test'],
              "output": [ "good:test" ]
            }
          },                  
          "platforms": platforms,
        }
      }
    }
  };
  
  let mgr = new this.Manager(config);
  
  // mgr.logger = console;
  yield mgr.init();
  
  const client = mgr.clients.pop();
  
  client.should.eql(Object.assign({}, config.clients.Maga, {
    id: 'Maga',
    state: {
      available: true,
    },
    activeCli: {
      url: 'http://badgerbadgerbadger.com',
      bin: 'maga',
      fullPath: path.join(__dirname, 'bin', 'maga'),
    }
  }));
};



test['search additional folders'] = function*() {
  const platforms = this.buildPlatformConfig(process.platform, process.arch, {
    "url": "http://badgerbadgerbadger.com",
    "bin": "rada"    
  });
  
  const config = {
    clients: {
      "Rada": {
        "homepage": "http://badgerbadgerbadger.com",
        "version": "1.0.0",
        "foo": "bar",
        "versionNotes": "http://badgerbadgerbadger.com",
        "cli": {
          "commands": {
            "sanityCheck": {
              "args": ['test'],
              "output": [ "good", "test" ]
            }
          },                  
          "platforms": platforms,
        }
      }
    }
  };
  
  let mgr = new this.Manager(config);
  
  // mgr.logger = console;
  yield mgr.init({
    folders: [
      path.join(__dirname, 'bin', 'folder2')
    ]
  });
  
  const client = mgr.clients.pop();
  
  client.should.eql(Object.assign({}, config.clients.Rada, {
    id: 'Rada',
    state: {
      available: true,
    },
    activeCli: {
      url: 'http://badgerbadgerbadger.com',
      bin: 'rada',
      fullPath: path.join(__dirname, 'bin', 'folder2', 'rada'),
    }
  }));
};



