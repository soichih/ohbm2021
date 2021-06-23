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

const venue = "mainauditorium";
const venue_name = "Main Auditorium";

const db = admin.firestore();

async function insert() {
    //const occupied_pos = await utils.occupied(venue, venue_name);
    occupied_pos = [];
    const users = await db.collection('users').get();
    let count = 0;
    users.forEach(async user=>{
        if(user.id.startsWith("fake.")) {
            count++;
            if(count > 20) {
                return;
            }
            
            const data = user.data();
            console.log(user.id, data);
            
            //pick a good spot
            let pos = null;
            while(true) {
                console.log(count, user.id, "finding pos..", pos);

                pos = utils.findpos();
                if(pos.column >= -8 && pos.column <= 8 && pos.row >= -5 && pos.row <= 5) { //for 1000
                    console.log("not good");
                    continue;
                }
                const occupied = occupied_pos.find(rec=>(rec.column == pos.column && rec.row == pos.row));
                if(occupied) {
                    console.log("occupied..");
                    continue;
                }

                break;
            }
            occupied_pos.push(pos);

            if(!data.enteredVenueIds) data.enteredVenueIds = [];
            if(!data.enteredVenueIds.includes(venue)) data.enteredVenueIds.push(venue);

            const update = {
                data: {[venue]: pos}, 
                enteredVenueIds: data.enteredVenueIds,
                lastSeenAt: new Date().getTime(),
                lastSeenIn: {[venue_name]: new Date().getTime()},
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


