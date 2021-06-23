#!/usr/bin/env node
const config = require('./config');
const admin = require('firebase-admin');
const fs = require('fs');
const async = require('async');
const {exec} = require('child_process');
const path = require('path');
const faker = require('faker');

const utils = require('./utils');

const pdfkit = require('pdfkit');

admin.initializeApp(config.firebase);

//const venue = "mainauditorium";
//const venue_name = "Main Auditorium";
//const venue = "symposiumhall1";
//const venue_name = "Symposium Hall 1";
const venue = "symposiumhall3";
const venue_name = "Symposium Hall 3";

const db = admin.firestore();

async function insert() {
    //const occupied_pos = await utils.occupied(venue, venue_name);
    occupied_pos = [];
    const users = await db.collection('users').get();
    users.forEach(async user=>{
        if(user.id.startsWith("fake.")) {
            const data = user.data();
            console.log(user.id, data);
            
            const update = {
                lastSeenAt: new Date().getTime(),
                lastSeenIn: {Home: new Date().getTime()},
            };
            console.dir(update);
            await user.ref.update(update);
        }
    });
}
insert();

/*
setInterval(()=>{
    const exepriences = await db.collection('users');

}, 1000);
*/


