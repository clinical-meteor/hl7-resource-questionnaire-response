import { HTTP } from 'meteor/http';
import { Meteor } from 'meteor/meteor';

import { QuestionnaireResponses } from '../lib/QuestionnaireResponses';
import { get } from 'lodash';

QuestionnaireResponses.after.insert(function (userId, doc) {

    //   // HIPAA Audit Log
    //   HipaaLogger.logEvent({eventType: "create", userId: userId, userName: '', collectionName: "QuestionnaireResponses"});

});
QuestionnaireResponses.after.update(function (userId, doc) {

//   // HIPAA Audit Log
//   HipaaLogger.logEvent({eventType: "update", userId: userId, userName: '', collectionName: "QuestionnaireResponses"});


});
QuestionnaireResponses.after.remove(function (userId, doc) {
  // ...
});
