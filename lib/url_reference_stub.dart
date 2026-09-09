String? readTopicReference() => Uri.base.queryParameters['topic'];

void replaceTopicReference(String? reference) {}

String? readMlReference() {
  final segments = Uri.base.fragment
      .split('/')
      .where((part) => part.isNotEmpty);
  final values = segments.toList();
  return values.length >= 2 && values.first == 'ml' ? values[1] : null;
}

void replaceMlReference(String? reference) {}
