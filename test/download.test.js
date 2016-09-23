"use strict";

const _get = require('lodash.get'),
  fs = require('fs'),
  path = require('path');

const test = require('./_base')(module);


test.before = function*() {
  yield this.startServer();
};


test.after = function*() {
  yield this.stopServer();
};



test['no clients'] = function*() {
  let mgr = new this.Manager({
    "clients": {} 
  });
  
  try {
    // mgr.logger = console;
    yield mgr.download('Maga');
    throw -1;
  } catch (err) {
    err.message.should.eql('Maga missing configuration for this platform.');
  }
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
  
  try {
    yield mgr.download('Maga');
    throw -1;
  } catch (err) {
    err.message.should.eql(`Maga missing configuration for this platform.`);
  }
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
  
  try {
    yield mgr.download('Maga');
    throw -1;
  } catch (err) {
    err.message.should.eql(`Maga missing configuration for this platform.`);
  }
};



test['download info not available'] = function*() {
  const platforms = this.buildPlatformConfig(process.platform, process.arch, {
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
  
  try {
    yield mgr.download('Maga');
    throw -1;
  } catch (err) {
    err.message.should.eql(`Download info not available for Maga`);
  }
};



test['download url not available'] = function*() {
  const platforms = this.buildPlatformConfig(process.platform, process.arch, {
    download: {
      type: 'blah'
    },
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
  
  try {
    yield mgr.download('Maga');
    throw -1;
  } catch (err) {
    err.message.should.eql(`Download info not available for Maga`);
  }
};


test['download unpack command not available'] = function*() {
  const platforms = this.buildPlatformConfig(process.platform, process.arch, {
    download: {
      url: 'http://adsfasd.com'
    },
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
  
  try {
    yield mgr.download('Maga');
    throw -1;
  } catch (err) {
    err.message.should.eql(`Download info not available for Maga`);
  }
};



test['download fails'] = function*() {
  const platforms = this.buildPlatformConfig(process.platform, process.arch, {
    download: {
      url: `${this.archiveTestHost}/invalid.zip`,
      type: 'zip'
    },
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
  
  try {
    yield mgr.download('Maga');
    throw -1;
  } catch (err) {
    err.message.should.contain(`Error downloading package for Maga`);
  }
};



test['unsupported archive type'] = function*() {
  const platforms = this.buildPlatformConfig(process.platform, process.arch, {
    download: {
      url: `${this.archiveTestHost}/maga2-good.zip`,
      type: 'blah'
    },
    "bin": "maga2"    
  });
  
  let mgr = new this.Manager({
    clients: {
      "Maga2": {
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
  
  try {
    yield mgr.download('Maga2');
    throw -1;
  } catch (err) {
    err.message.should.contain(`Unsupported archive type: blah`);
  }
};





test['custom unpack handler'] = {
  before: function*() {
    const platforms = this.buildPlatformConfig(process.platform, process.arch, {
      download: {
        url: `${this.archiveTestHost}/maga2-good.zip`,
        type: 'invalid'
      },
      "bin": "maga2"    
    });
    
    let mgr = new this.Manager({
      clients: {
        "Maga2": {
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
    
    this.mgr = mgr;
  },
  
  success: function*() {
    let spy = this.mocker.spy(() => Promise.resolve());
    
    yield this.mgr.download('Maga2', {
      unpackHandler: spy
    });    
    
    spy.should.have.been.calledOnce;
    spy.getCall(0).args.length.should.eql(2);
  },
  
  fail: function*() {
    try {
      yield this.mgr.download('Maga2', {
        unpackHandler: () => Promise.reject(new Error('foo!'))
      });        
      throw -1;      
    } catch (err) {
      err.message.should.contain(`foo!`);
    }
  }
};





test['unpacks and verifies ok'] = function*() {
  const platforms = this.buildPlatformConfig(process.platform, process.arch, {
    download: {
      url: `${this.archiveTestHost}/maga2-good.zip`,
      type: 'zip'
    },
    "bin": "maga2"    
  });
  
  let mgr = new this.Manager({
    clients: {
      "Maga2": {
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
  
  let ret = yield mgr.download('Maga2');
  
  const downloadFolder = _get(ret, 'downloadFolder', '');
  _get(ret, 'downloadFile', '').should.eql(path.join(downloadFolder, `archive.zip`));
  _get(ret, 'unpackFolder', '').should.eql(path.join(downloadFolder, `unpacked`));

  _get(ret, 'client.state.available', '').should.be.true;
  _get(ret, 'client.activeCli.fullPath', '').should.eql(path.join(downloadFolder, `unpacked`, 'maga2'));
  
  mgr.clients.pop().should.eql(ret.client);
};




