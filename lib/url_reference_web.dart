import 'package:web/web.dart' as web;

String? readTopicReference() {
  return Uri.parse(web.window.location.href).queryParameters['topic'];
}

void replaceTopicReference(String reference) {
  final current = Uri.parse(web.window.location.href);
  final parameters = Map<String, String>.from(current.queryParameters)
    ..['topic'] = reference;
  final next = current.replace(queryParameters: parameters, fragment: '');
  web.window.history.replaceState(null, '', next.toString());
}
