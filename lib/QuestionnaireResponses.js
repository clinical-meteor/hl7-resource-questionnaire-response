import SimpleSchema from 'simpl-schema';

if(Package['clinical:autopublish']){
  console.log("*****************************************************************************")
  console.log("HIPAA WARNING:  Your app has the 'clinical-autopublish' package installed.");
  console.log("Any protected health information (PHI) stored in this app should be audited."); 
  console.log("Please consider writing secure publish/subscribe functions and uninstalling.");  
  console.log("");  
  console.log("meteor remove clinical:autopublish");  
  console.log("");  
}
if(Package['autopublish']){
  console.log("*****************************************************************************")
  console.log("HIPAA WARNING:  DO NOT STORE PROTECTED HEALTH INFORMATION IN THIS APP. ");  
  console.log("Your application has the 'autopublish' package installed.  Please uninstall.");
  console.log("");  
  console.log("meteor remove autopublish");  
  console.log("meteor add clinical:autopublish");  
  console.log("");  
}






// create the object using our BaseModel
QuestionnaireResponse = BaseModel.extend();

//Assign a collection so the object knows how to perform CRUD operations
QuestionnaireResponse.prototype._collection = QuestionnaireResponses;

// Create a persistent data store for addresses to be stored.
// HL7.Resources.Patients = new Mongo.Collection('HL7.Resources.Patients');

if(typeof QuestionnaireResponses === 'undefined'){
  if(Package['clinical:autopublish']){
    QuestionnaireResponses = new Mongo.Collection('QuestionnaireResponses');
  } else {
    QuestionnaireResponses = new Mongo.Collection('QuestionnaireResponses', {connection: null});
  }
}


//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
QuestionnaireResponses._transform = function (document) {
  return new QuestionnaireResponse(document);
};



QuestionnaireResponseSchema = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "QuestionnaireResponse"
    },
  "identifier" : {
    optional: true,
    type:  Array
    },
  "identifier.$" : {
    optional: true,
    type:  IdentifierSchema 
    },
  "questionnaire" : {
    optional: true,
    type: ReferenceSchema //Questionnaire
    },
  "status" : {
    optional: true,
    type: String
    },
  "subject" : {
    optional: true,
    type: ReferenceSchema // Any
    },
  "author" : {
    optional: true,
    type: ReferenceSchema // (Device|Practitioner|Patient|RelatedPerson)
    },
  "authored" : {
    optional: true,
    type: Date
    },
  "source" : {
    optional: true,
    type: ReferenceSchema //(Patient|Practitioner|RelatedPerson)
    },
  "encounter" : {
    optional: true,
    type: ReferenceSchema //(Encounter)
    },
  "group" : {
    optional: true,
    type: Object
    },
  "group.linkId" : {
    optional: true,
    type: String
    },
  "group.title" : {
    optional: true,
    type: String
    },
  "group.text" : {
    optional: true,
    type: String
    },
  "group.subject" : {
    optional: true,
    type: ReferenceSchema //(Any)
    },
  "group.group" : {
    optional: true,
    blackbox: true,
    type: Array
    },
  "group.group.$" : {
    optional: true,
    blackbox: true,
    type: Object 
    },

  "group.question" : {
    optional: true,
    type:  Array
    },
  "group.question.$" : {
    optional: true,
    type:  Object 
    },    
  "group.question.$.linkId" : {
    optional: true,
    type: String
    },
  "group.question.$.text" : {
    optional: true,
    type: String
    },
  "group.question.$.answer" : {
    optional: true,
    type:  Array
    },
  "group.question.$.answer.$" : {
    optional: true,
    type:  Object 
    },
  "group.question.$.answer.$.valueBoolean" : {
    optional: true,
    type: Boolean
    },
  "group.question.$.answer.$.valueDecimal" : {
    optional: true,
    type: Boolean
    },
  "group.question.$.answer.$.valueInteger" : {
    optional: true,
    type: Number
    },
  "group.question.$.answer.$.valueDate" : {
    optional: true,
    type: Date
    },
  "group.question.$.answer.$.valueDateTime" : {
    optional: true,
    type: Date
    },
  "group.question.$.answer.$.valueInstant" : {
    optional: true,
    type: String
    },
  "group.question.$.answer.$.valueTime" : {
    optional: true,
    type: Date
    },
  "group.question.$.answer.$.valueString" : {
    optional: true,
    type: String
    },
  "group.question.$.answer.$.valueUri" : {
    optional: true,
    type: String
    },
  "group.question.$.answer.$.valueAttachment" : {
    optional: true,
    type: AttachmentSchema
    },
  "group.question.$.answer.$.valueCoding" : {
    optional: true,
    type: CodingSchema
    },
  "group.question.$.answer.$.valueQuantity" : {
    optional: true,
    type: QuantitySchema
    },
  "group.question.$.answer.$.valueReference" : {
    optional: true,
    type: ReferenceSchema //(Any)
    }
});

BaseSchema.extend(QuestionnaireResponseSchema);
DomainResourceSchema.extend(QuestionnaireResponseSchema);

QuestionnaireResponses.attachSchema(QuestionnaireResponseSchema);

export default { QuestionnaireResponse, QuestionnaireResponses, QuestionnaireResponseSchema };