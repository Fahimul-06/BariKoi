-- Storage policies for property-photos bucket
CREATE POLICY "Public read property photos"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'property-photos');

CREATE POLICY "Authenticated upload property photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'property-photos');

CREATE POLICY "Owner delete property photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'property-photos' AND auth.uid() = owner);

CREATE POLICY "Owner update property photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'property-photos' AND auth.uid() = owner)
  WITH CHECK (bucket_id = 'property-photos');
