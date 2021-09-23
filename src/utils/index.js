  
export function GetQueryString(name) {
	let url2 =window.location.href;
        let temp2 = url2.split('?')[1];
        let pram2 = new URLSearchParams('?'+temp2);
        return pram2.get(name);
  }