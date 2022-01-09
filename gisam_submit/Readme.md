## Simple ui
### Gisam

##### Region location
Taipei

##### Team Members
-Gisam - all roles, i'm a french C / backend js developper
#### Project Description

This is a simple ui for the project.


#### Summary

What i understand from effect network: it's a two sided comunnity you have one side people doing tasks and the other is people giving them tasks
My assumption are:
The taskers are all over the world mostly from developping countries (at least for simple task like image labelling)
The task giver are not necessary developper, they don't necessarily want the public to have access to the data they payed for

What i started to develop:
A simple ui for both tasker an task giver.
From the tasker perspective, what i tried to address, people from developping countries are on mobile first:
-I integrated mobile wallet (with wallet connect)
-I tried to localised the app because you should be able to participate without speaking english
From the task giver people:
-I created a mechanism to create campaign without any coding knowledge, you can create different kind of questions : multiple choice questions / number / test
-I wanted add a mechanism to let people encrypt the answer they give so only the requester have access to it(with his private key), unfortunaly no time tot finish as the submit task part is not working, the code is in tools.js

This is also designed in a way to remove the need for executing javascript from other people (i reported a potential security issue to the team about that)

This way of creating campaign have pro and cons
pros:
-easier for non developper
-standardisation of tasks for people
-the ui can have data validation included for better quality answers
-the tasks are lighter (no template data), which can be significative since all the data is downloaded when iterating over campaigns
cons:
-the customisation possibilities are lower
-it's need developement from the project team to develop campaign for different kind of data

#### URLs
here is the prototype: https://hackaton-finale.vercel.app/

#### Presentation
video presenting the project step by step: /assets/hackatongisam.mp4

#### Next Steps
The developpement state is partial as i'm lacking time
Need:
-implementing the submission part, along with encryption
-a real design
-better error handling
-more template for campaign
-adding auto translation for the campaign description / title etc (effect translation if possible).

#### License
MIT
