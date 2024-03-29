import { SingleBar, Presets } from "cli-progress";
import chalk from "chalk";
import { appendResultsToFile } from "./accs.js";
export const c = chalk;

class Numbers {
    bigIntToFloatStr(amount, decimals) {
        return formatUnits(amount, decimals);
    }
    bigIntToPrettyFloatStr(amount, decimals) {
        return parseFloat(formatUnits(amount, decimals)).toFixed(5);
    }
    floatStringToBigInt(floatString, decimals) {
        return parseUnits(floatString, decimals);
    }
    sortArrayIncreasing(array) {
        if (array.length <= 1) return array;
        /* any sorting should be applied here.. */
        return array;
    }
}
export const NumbersHelpers = new Numbers();

class Random {
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    getRandomIntFromTo(min, max) {
        const delta = max - min;
        return Math.round(min + Math.random() * delta);
    }
    getRandomBnFromTo(min, max) {
        const delta = BigInt(max) - BigInt(min);
        const random = BigInt(Math.round(Math.random() * 100));
        return min + (delta * random) / 100n;
    }
    getRandomDeadline() {
        let hour = 3600;
        let tsNow = Date.now() / 1000; // timestamp in sec
        // deadline from +1 day to +6 days
        let tsRandom = Math.round(tsNow + hour * (Math.random() * this.getRandomInt(3) + 1));
        return tsRandom;
    }
    shuffleArray(oldArray) {
        let array = oldArray.slice();
        let buf;
        for (let i = 0; i < array.length; i++) {
            buf = array[i];
            let randNum = Math.floor(Math.random() * array.length);
            array[i] = array[randNum];
            array[randNum] = buf;
        }
        return array;
    }
    chooseKeyFromStruct(struct, notKey = "") {
        const keys = Object.keys(struct);
        let res = keys[Math.floor(Math.random() * keys.length)];
        while (res == notKey) {
            res = keys[Math.floor(Math.random() * keys.length)];
        }
        return res;
    }
    chooseElementFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}
export const RandomHelpers = new Random();

export async function sleep(sec, reason = "Sleep") {
    if (sec > 1) {
        sec = Math.round(sec);
    }
    let bar = new SingleBar(
        { format: `${reason} | ${c.blueBright("{bar}")} | {percentage}% | {value}/{total} sec` },
        Presets.rect,
    );
    bar.start(sec, 0);
    for (let i = 0; i < sec; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1 * 1000));
        bar.increment();
    }
    bar.stop();
    process.stdout.clearLine(0);
}
export async function defaultSleep(sec, needProgress = true) {
    if (needProgress) {
        let newpaste = ["-", `\\`, `|`, `/`];
        for (let i = 0; i < sec * 3; i++) {
            process.stdout.clearLine(0); // clear current text
            process.stdout.cursorTo(0);
            process.stdout.write(`${newpaste[i % 4]}`);
            await await new Promise((resolve) => setTimeout(resolve, 333));
        }
        process.stdout.clearLine(0); // clear current text
        process.stdout.cursorTo(0);
        return;
    }
    return await new Promise((resolve) => setTimeout(resolve, sec * 1000));
}
export async function delayedPrint(paste, delay = 0.033) {
    for (let i = 0; i < paste.length; i++) {
        process.stdout.write(paste[i]);
        await defaultSleep(delay, false);
    }
}

export async function logResult(index, wallet, key, result) {
    let paste = index + "," + wallet + "," + key + "," + result;
    if (result) {
        console.log(c.green(`[${index}] ${wallet} registered`));
    } else {
        console.log(c.red(`[${index}] ${wallet} did not register`));
    }
    appendResultsToFile("./results.csv", paste);
}
