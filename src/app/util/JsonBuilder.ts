export class JsonBuilder {
  constructor() {}

  buildJson(query: string) {
    try {
      let json = {};
      let operator = null;
      let tempQuery = query
        .replace(/\s/g, "")
        .split(/[()]/)
        .filter(i => (i ? true : false));
      tempQuery.forEach(subQuery => {
        let regex = /^[a-zA-Z0-9=|&]*$/;
        if (!regex.test(subQuery)) {
          throw new Error();
        }
        // console.log("subQuery ; ", subQuery);
        if (!operator && (subQuery === "&&" || subQuery === "||")) {
          operator = subQuery;
        } else if (operator === "&&") {
          operator = null;
          json = {
            and: [json, this.processQuery(subQuery)]
          };
        } else if (operator === "||") {
          operator = null;
          json = {
            or: [json, this.processQuery(subQuery)]
          };
        } else {
          let res = this.processQuery(subQuery);
          // console.log(json, " ", res);
          json = Object.assign(json, res);
        }
      });
      return json;
    } catch (err) {
      // console.log("err : ", err);
      throw new Error("INVALID");
    }
  }

  processQuery(subQuery: string) {
    let result = {};
    if (subQuery.includes("||")) {
      return this.toOr(subQuery);
    } else if (subQuery.includes("&&")) {
      return this.toAnd(subQuery);
    } else {
      if (subQuery.includes("=")) {
        let data = subQuery.split("=");
        if (data[0] && data[1]) {
          result[data[0]] = data[1];
        } else {
          throw new Error();
        }
      } else {
        throw new Error();
      }
      return result;
    }
  }

  toAnd(str: string) {
    let data = str.replace(/\s/g, "").split("&&");
    return { and: this.getValue(data) };
  }

  toOr(str: string) {
    let data = str.replace(/\s/g, "").split("||");
    return { or: this.getValue(data) };
  }

  getValue(data: Array<string>) {
    let value = {};
    data.forEach(d => {
      if (d.includes("=")) {
        let val = d.split("=");
        if (val[0] && val[1]) {
          value[val[0]] = val[1];
        } else {
          throw new Error();
        }
      } else {
        throw new Error();
      }
    });
    return value;
  }
}
