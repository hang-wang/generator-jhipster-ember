var ApplicationAdapter = DS.RESTAdapter;
DS.RESTAdapter.reopen({
    host: ENV.api_url,
    namespace: ENV.api_namespace
});

export default ApplicationAdapter;
