
QuestionnaireResponses = new Meteor.Collection('questionnaireResponses');

if (Meteor.isClient){
  Meteor.subscribe('questionnaireResponses');
}



QuestionnaireResponseSchema = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "QuestionnaireResponse"
    },
  "identifier" : {
    type: Identifier
    },
  "questionnaire" : {
    type: ReferenceSchema //Questionnaire
    },
  "status" : {
    type: String
    },
  "subject" : {
    type: ReferenceSchema // Any
    },
  "author" : {
    type: ReferenceSchema // (Device|Practitioner|Patient|RelatedPerson)
    },
  "authored" : {
    type: Date
    },
  "source" : {
    type: ReferenceSchema //(Patient|Practitioner|RelatedPerson)
    },
  "encounter" : {
    type: ReferenceSchema //(Encounter)
    },
  "group.linkId" : {
    type: String
    },
  "group.title" : {
    type: String
    },
  "group.text" : {
    type: String
    },
  "group.subject" : {
    type: ReferenceSchema //(Any)
    },
  "group.group" : {
    type: [ Group ]
    },
  "group.question.$.linkId" : {
    type: String
    },
  "group.question.$.text" : {
    type: String
    },
  "group.question.$.answer.$.valueBoolean" : {
    type: Boolean
    },
  "group.question.$.answer.$.valueDecimal" : {
    type: Boolean
    },
  "group.question.$.answer.$.valueInteger" : {
    type: Integer
    },
  "group.question.$.answer.$.valueDate" : {
    type: Date
    },
  "group.question.$.answer.$.valueDateTime" : {
    type: DateTime
    },
  "group.question.$.answer.$.valueInstant" : {
    type: String
    },
  "group.question.$.answer.$.valueTime" : {
    type: Time
    },
  "group.question.$.answer.$.valueString" : {
    type: String
    },
  "group.question.$.answer.$.valueUri" : {
    type: String
    },
  "group.question.$.answer.$.valueAttachment" : {
    type: Attachment
    },
  "group.question.$.answer.$.valueCoding" : {
    type:Coding
    },
  "group.question.$.answer.$.valueQuantity" : {
    type: Quantity
    },
  "group.question.$.answer.$.valueReference" : {
    type: ReferenceSchema //(Any)
    }
});
QuestionnaireResponses.attachSchema(QuestionnaireResponseSchema);
