import legacyParse from '../legacyParse'

export default function legacyParseMap(array: any[]): Date[] {
  return array.map(item => legacyParse(item))
}
