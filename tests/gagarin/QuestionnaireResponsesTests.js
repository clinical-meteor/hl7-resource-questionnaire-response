describe('clinical:hl7-resources-questionnaire-responses', function () {
  var server = meteor();
  var client = browser(server);

  it('QuestionnaireResponses should exist on the client', function () {
    return client.execute(function () {
      expect(QuestionnaireResponses).to.exist;
    });
  });

  it('QuestionnaireResponses should exist on the server', function () {
    return server.execute(function () {
      expect(QuestionnaireResponses).to.exist;
    });
  });

});
