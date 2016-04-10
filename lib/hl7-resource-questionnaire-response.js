

// create the object using our BaseModel
QuestionnaireResponse = BaseModel.extend();


//Assign a collection so the object knows how to perform CRUD operations
QuestionnaireResponse.prototype._collection = QuestionnaireResponses;

// Create a persistent data store for addresses to be stored.
// HL7.Resources.Patients = new Mongo.Collection('HL7.Resources.Patients');
QuestionnaireResponses = new Mongo.Collection('QuestionnaireResponses');

//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
QuestionnaireResponses._transform = function (document) {
  return new QuestionnaireResponse(document);
};


if (Meteor.isClient){
  Meteor.subscribe("QuestionnaireResponses");
}

if (Meteor.isServer){
  Meteor.publish("QuestionnaireResponses", function (argument){
    if (this.userId) {
      return QuestionnaireResponses.find();
    } else {
      return [];
    }
  });
}

QuestionnaireResponseSchema = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "QuestionnaireResponse"
    },
  "identifier" : {
    type: IdentifierSchema
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
    type: [ GroupSchema ]
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
    type: Number
    },
  "group.question.$.answer.$.valueDate" : {
    type: Date
    },
  "group.question.$.answer.$.valueDateTime" : {
    type: Date
    },
  "group.question.$.answer.$.valueInstant" : {
    type: String
    },
  "group.question.$.answer.$.valueTime" : {
    type: Date
    },
  "group.question.$.answer.$.valueString" : {
    type: String
    },
  "group.question.$.answer.$.valueUri" : {
    type: String
    },
  "group.question.$.answer.$.valueAttachment" : {
    type: AttachmentSchema
    },
  "group.question.$.answer.$.valueCoding" : {
    type: CodingSchema
    },
  "group.question.$.answer.$.valueQuantity" : {
    type: QuantitySchema
    },
  "group.question.$.answer.$.valueReference" : {
    type: ReferenceSchema //(Any)
    }
});
QuestionnaireResponses.attachSchema(QuestionnaireResponseSchema);
