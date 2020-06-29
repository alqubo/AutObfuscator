import * as fs from 'fs';
import * as recursive from 'recursive-readdir';
import * as ObfuscatorJS from 'javascript-obfuscator';

export class Obfuscator {

    private readonly dir: string;
    private readonly minFiles: boolean;

    constructor(dir: string, minFiles?: boolean) {
        this.dir = dir;
        this.minFiles = minFiles || false;

        this.readDirs();
    }

    readDirs = () => {

        const ignore = (file: string, stats: fs.Stats) => {
            const gitRegex = new RegExp(/.git/);
            if(stats.isDirectory() && gitRegex.exec(file)?.index > 0) {
                return true
            }

            if(stats.isDirectory()) return false;

            const minFile = new RegExp(/.min.js/).exec(file)?.index;
            const mapFile = new RegExp(/.js.map/).exec(file)?.index;
            const jsFile = new RegExp(/.js/).exec(file)?.index;

            if(minFile || mapFile) return true;

            return !jsFile;
        }

        recursive(this.dir, [ignore], (err, files) => {
            if(err) process.exit(1);
            this.loadCodes(files);
        });
    }

    loadCodes = (files: string[]) => {
        files.forEach((file) => {
            const code = this.loadFile(file);
            const obfuscatedCode = this.obfuscateCode(code);
            this.saveCode(file, obfuscatedCode);
        });
    }

    loadFile = (route: string) => {
        return fs.readFileSync(route, {encoding: 'utf-8'});
    }

    obfuscateCode = (code: string) => {
        const options = {
            compact: true,
            controlFlowFlattening: true
        };
        const result = ObfuscatorJS.obfuscate(code, options);
        return result.getObfuscatedCode();
    }

    saveCode = (route: string, code: string) => {
        // TODO: Add -f checker to save .min.js file
        fs.writeFileSync(route, code, {encoding: 'utf-8'});
    }

}