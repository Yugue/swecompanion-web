import 'package:web/web.dart' as web;

String? readTopicReference() {
  return Uri.parse(web.window.location.href).queryParameters['topic'];
}

void replaceTopicReference(String? reference) {
  final current = Uri.parse(web.window.location.href);
  final parameters = Map<String, String>.from(current.queryParameters);
  if (reference == null) {
    parameters.remove('topic');
  } else {
    parameters['topic'] = reference;
  }
  final next = Uri(
    scheme: current.scheme,
    userInfo: current.userInfo,
    host: current.host,
    port: current.hasPort ? current.port : null,
    path: current.path,
    queryParameters: parameters.isEmpty ? null : parameters,
  );
  web.window.history.replaceState(null, '', next.toString());
}
