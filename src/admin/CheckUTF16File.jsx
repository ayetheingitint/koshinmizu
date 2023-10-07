import React, { useState, useEffect, useRef } from 'react';
import {
    Page,
    Input,
    List,
    ListItem,
    Row,
    Col, Button
} from 'react-onsenui';

/*CheckUTF16File Component*/
/*   UTF 16 File 確認関数*/
/*   Input Parameter→ 選択File*/
export function checkUTF16File(selectedFile, callback) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const content = new Uint8Array(event.target.result);
        //  UTF-16LE BOM (Byte Order Mark) 確認する
        if (content.length >= 2 && content[0] === 0xFF && content[1] === 0xFE) {
            //  UTF-16LE場合
            const fileCheck = true;
            callback(fileCheck);

        } else {
            //  UTF-16LEじゃない場合
            const fileCheck = false;
            callback(fileCheck);


        }
    };

    //  the first 2 bytes to check for the BOM読み
    reader.readAsArrayBuffer(selectedFile.slice(0, 2));
};





