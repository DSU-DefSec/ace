import { configure, fs } from '@zenfs/core';
import { WebStorage } from '@zenfs/dom';

await configure({
    mounts: {
        "/": WebStorage
    },
	addDevices: true,
});

const decoder = new TextDecoder();

const stdio = {};

let err_buffer = "";
let out_buffer = "";

const old_writeSync = fs.writeSync;
stdio.writeSync = (fd, buf) => {
    if(fd == 1) {
        out_buffer += decoder.decode(buf);
        if(out_buffer.includes("\n")) {
            let line = out_buffer.split("\n", 1)[0];
            console.log(line);
            out_buffer = out_buffer.slice(line.length+1);
        }
        return buf.length;
    } else if(fd == 2) {
        err_buffer += decoder.decode(buf);
        if(err_buffer.includes("\n")) {
            let line = err_buffer.split("\n", 1)[0];
            console.error(line);
            err_buffer = err_buffer.slice(line.length+1);
        }
        return buf.length;
    } else {
        return old_writeSync(fd, buf);
    }
};

const old_write = fs.write;
stdio.write = (fd, buf, offset, length, position, callback) => {
    if(fd == 1) {
        out_buffer += decoder.decode(buf.slice(offset, offset+length));
        if(out_buffer.includes("\n")) {
            let line = out_buffer.split("\n", 1)[0];
            console.log(line);
            out_buffer = out_buffer.slice(line.length+1);
        }
        callback(null, length, buf);
    } else if(fd == 2) {
        err_buffer += decoder.decode(buf.slice(offset, offset+length));
        if(err_buffer.includes("\n")) {
            let line = err_buffer.split("\n", 1)[0];
            console.error(line);
            err_buffer = err_buffer.slice(line.length+1);
        }
        callback(null, length, buf);
    } else {
        return old_write(fd, buf, offset, length, position, callback);
    }
}

const old_read = fs.read;
stdio.read = (fd, buffer, offset, length, position, callback) => {
    if(fd == 0) {
        // console.log(decoder.decode(buf.slice(offset, offset+length)));
        const err = new Error("stdin is closed");
        err.code = "EBADF";
        callback(err, 0, buffer);
    } else {
        return old_read(fd, buffer, offset, length, position, callback);
    }
}

const handler = {
    get(target, property) {
        return stdio[property] || target[property];
    }
}

globalThis.fs = new Proxy(fs, handler);

// let file = await fs.open("/test.txt", "w");

// await file.write("Hello, World!\n");

// await file.close();


// fs.writeFileSync('/test.txt', 'This will persist across reloads!');

// const contents = fs.readFileSync('/test.txt', 'utf-8');
// console.log(contents);