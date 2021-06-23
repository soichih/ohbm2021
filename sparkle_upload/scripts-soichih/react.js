#!/usr/bin/env node
const config = require('./config');
const admin = require('firebase-admin');
const fs = require('fs');
const async = require('async');
const {exec} = require('child_process');
const path = require('path');
const faker = require('faker');

const pdfkit = require('pdfkit');

admin.initializeApp(config.firebase);

function findpos() {
    return {
        column: (Math.random()*26 - 13)|0,
        row: (Math.random()*20 - 10)|0,
    }
}

const venue = "mainauditorium";
//const venue = "symposiumhall3";

const db = admin.firestore();

async function react() {
    const experiences = db.collection('experiences');
    const reactions = experiences.doc(venue).collection('reactions');
     
    const users = await db.collection('users').get();
    let count = 0;
    users.forEach(async user=>{
        if(user.id.startsWith("fake.")) {
            
            //limit users
            count++;
            if(count > 50) return;
            
            setTimeout(async ()=>{
                const data = user.data();
                console.log(user.id, data);
                const res = await reactions.doc().set({
                    created_at: new Date().getTime(),
                    created_by: user.id,

                    //reaction: "heart",
                    //reaction: "clap",
                    //reaction: "wolf",
                    //reaction: "laugh",
                    //reaction: "burn",
                    //reaction: "sparkle",

                    //short mesage
                    reaction: "messageToTheBand", //??
                    //text: faker.hacker.phrase(),
                    //text: faker.company.catchPhrase(),
                    //text: faker.company.bs(),
                    //text: faker.lorem.sentence(),
                    text: faker.random.words(),
                });
                console.dir(res);
            }, Math.random()*30*1000);
        }
    });
}
react();

/*
setInterval(()=>{
    const exepriences = await db.collection('users');

}, 1000);
*/


