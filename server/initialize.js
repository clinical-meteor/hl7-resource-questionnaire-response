// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  if (process.env.INITIALIZE) {
    console.log('INITIALZING');
    if (QuestionnaireResponses.find().count() === 0) {
    console.log('No QuestionnaireResponses found.  Creating some...');

      // var orderId = QuestionnaireResponses.insert({
      //   orderer: {
      //     display: "Jane Doe",
      //     reference: "Jane Doe"
      //   },
      //   public: true,
      //   ordinal: 1,
      //   status: "completed",
      //   event: [{
      //     description: "Referred to rheumatology.",
      //     dateTime: new Date(2009, 10, 13)
      //   }],
      //   note: ["Pt sudden onset left sidded numbness, S/P ER visit, being followed by neuro.  Childhood hx of delayed myelinization."]
      // });
      // console.log('orderId', orderId);

    }
  }
});
