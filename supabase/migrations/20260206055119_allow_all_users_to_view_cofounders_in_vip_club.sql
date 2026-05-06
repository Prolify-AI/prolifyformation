/*
  # Allow users to view all co-founders for networking

  1. Changes
    - Add a new policy to allow authenticated users to view all co-founders
    - This enables the VIP Club networking feature where users can discover potential co-founders

  2. Security
    - Only authenticated users can view co-founder profiles
    - Maintains existing restrictions for insert, update, and delete operations
    - Users can still only modify co-founders in their own company
*/

-- Add policy to allow all authenticated users to view all co-founders for networking purposes
CREATE POLICY "Authenticated users can view all co-founders for networking"
  ON co_founders
  FOR SELECT
  TO authenticated
  USING (true);
