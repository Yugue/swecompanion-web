import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:swe_companion/main.dart';

void main() {
  testWidgets('shows the interview study workspace', (tester) async {
    SharedPreferences.setMockInitialValues({});
    await tester.pumpWidget(const SweCompanionApp());
    await tester.pumpAndSettle();

    expect(find.text('SWE Companion'), findsOneWidget);
    expect(find.text('Keep the patterns sharp.'), findsOneWidget);
  });
}
