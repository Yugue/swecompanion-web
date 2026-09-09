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

String? readMlReference() {
  final fragment = Uri.parse(web.window.location.href).fragment;
  final values = fragment.split('/').where((part) => part.isNotEmpty).toList();
  return values.length >= 2 && values.first == 'ml' ? values[1] : null;
}

void replaceMlReference(String? reference) {
  final path = reference == null ? '/ml' : '/ml/$reference';
  web.window.history.replaceState(null, '', '#$path');
}
