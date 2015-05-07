/* global describe:true, it:true */
'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Promise = require('bluebird');

var expect = chai.expect;
chai.use(sinonChai);

var installTractorDependenciesLocally = require('./install-tractor-dependencies-locally');

describe('server/cli/init: install-tractor-dependencies-locally:', function () {
    it('should get the list of currently installed npm dependencies', function () {
        var childProcess = require('child_process');
        var log = require('../../utils/logging');
        var Promise = require('bluebird');
        sinon.stub(childProcess, 'exec').returns({
            stdout: {
                on: function (event, callback) {
                    callback('');
                }
            }
        });
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(''));
        sinon.stub(log, 'info');
        sinon.stub(log, 'success');

        return installTractorDependenciesLocally.run()
        .then(function () {
            expect(childProcess.exec).to.have.been.calledWith('npm ls --depth 0');
        })
        .finally(function () {
            childProcess.exec.restore();
            childProcess.execAsync.restore();
            log.info.restore();
            log.success.restore();
        });
    });

    it('should install all of the required dependencies', function () {
        var childProcess = require('child_process');
        var log = require('../../utils/logging');
        var Promise = require('bluebird');
        sinon.stub(childProcess, 'exec').returns({
            stdout: {
                on: function (event, callback) {
                    callback('');
                }
            }
        });
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(''));
        sinon.stub(log, 'info');
        sinon.stub(log, 'success');

        return installTractorDependenciesLocally.run()
        .then(function () {
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact bluebird@2.3.11');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact chai@1.10.0');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact chai-as-promised@4.1.1');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact cucumber@0.4.4');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact httpbackend@1.2.0');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact protractor@1.4.0');
        })
        .finally(function () {
            childProcess.exec.restore();
            childProcess.execAsync.restore();
            log.info.restore();
            log.success.restore();
        });
    });

    it('should skip the dependencies that have already been installed', function () {
        var childProcess = require('child_process');
        var log = require('../../utils/logging');
        sinon.stub(childProcess, 'exec').returns({
            stdout: {
                on: function (event, callback) {
                    callback('bluebird@2.3.11');
                }
            }
        });
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(''));
        sinon.stub(log, 'info');
        sinon.stub(log, 'success');

        return installTractorDependenciesLocally.run()
        .then(function () {
            expect(childProcess.execAsync).not.to.have.been.calledWith('npm install --save-dev --save-exact bluebird@2.3.11');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact chai@1.10.0');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact chai-as-promised@4.1.1');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact cucumber@0.4.4');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact httpbackend@1.2.0');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact protractor@1.4.0');
        })
        .finally(function () {
            childProcess.exec.restore();
            childProcess.execAsync.restore();
            log.info.restore();
            log.success.restore();
        });
    });

    it('should tell the user what it is doing', function () {
        var childProcess = require('child_process');
        var log = require('../../utils/logging');
        var Promise = require('bluebird');
        sinon.stub(childProcess, 'exec').returns({
            stdout: {
                on: function (event, callback) {
                    callback('');
                }
            }
        });
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(''));
        sinon.stub(log, 'info');
        sinon.stub(log, 'success');

        return installTractorDependenciesLocally.run()
        .then(function () {
            expect(log.info).to.have.been.calledWith('Checking installed npm dependencies...');
            expect(log.info).to.have.been.calledWith('Installing npm dependencies for tractor...');
            expect(log.info).to.have.been.calledWith('Installing "bluebird@2.3.11"...');
            expect(log.success).to.have.been.calledWith('Installed "bluebird@2.3.11".');
        })
        .finally(function () {
            childProcess.exec.restore();
            childProcess.execAsync.restore();
            log.info.restore();
            log.success.restore();
        });
    });

    it('should tell the user if all dependencies are already installed', function () {
        var childProcess = require('child_process');
        var log = require('../../utils/logging');
        var Promise = require('bluebird');
        sinon.stub(childProcess, 'exec').returns({
            stdout: {
                on: function (event, callback) {
                    callback('bluebird@2.3.11 chai@1.10.0 chai-as-promised@4.1.1 cucumber@0.4.4 httpbackend@1.2.0 protractor@1.4.0');
                }
            }
        });
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(''));
        sinon.stub(log, 'info');
        sinon.stub(log, 'success');

        return installTractorDependenciesLocally.run()
        .then(function () {
            expect(log.info).to.have.been.calledWith('All npm dependencies for tractor already installed.');
        })
        .finally(function () {
            childProcess.exec.restore();
            childProcess.execAsync.restore();
            log.info.restore();
            log.success.restore();
        });
    });

    it('should tell the user if a dependency cannot be installed', function () {
        var childProcess = require('child_process');
        var log = require('../../utils/logging');
        sinon.stub(childProcess, 'exec').returns({
            stdout: {
                on: function (event, callback) {
                    callback('');
                }
            }
        });
        var exec = sinon.stub(childProcess, 'execAsync');
        exec.returns(Promise.reject(new Error()));
        sinon.stub(log, 'info');
        sinon.stub(log, 'error');

        return installTractorDependenciesLocally.run()
        .then(function () {
            expect(log.error).to.have.been.calledWith('Couldn\'t install "bluebird@2.3.11". Either run `tractor init` again, or install it manually by running "npm install bluebird@2.3.11"');
        })
        .finally(function () {
            childProcess.exec.restore();
            childProcess.execAsync.restore();
            log.info.restore();
            log.error.restore();
        });
    });
});
