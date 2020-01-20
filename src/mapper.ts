interface ObservableData {
  [key: string]: any;
}

interface ReactionsMap {
  [key: string]: Function;
}

/**
 * This handles the relation mapping between reactions
 * and observable values. possibiliting reactions disposing
 * in a performant way.
 */
class DataMapper {
  values: ObservableData = {};
  reactions: ReactionsMap = {};
}

export const dataMapper = new DataMapper();
