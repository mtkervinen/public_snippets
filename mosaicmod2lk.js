//VERSION=3

// 2 main classes

let A_KUIVA1 = 1;
let A_KUIVA2 = 2;
let A_KUIVA3 = 3;
let A_KUIVA4 = 4;
let A_VESI1  = 5;
let A_VESI2  = 6;
let A_VESI3  = 7;

function mndwi12(samples) {
    return index(samples.B03, samples.B12);
}

function mndwi11(samples) {
    return index(samples.B03, samples.B11);
}

function class2rgb(cl,dm) {
  
    switch (cl) {
    case 0: return [255,255,255,dm];
    case A_KUIVA1: return [0,100,0,dm];
    case A_KUIVA2: return [0,150,0,dm];
    case A_KUIVA3: return [0,200,0,dm];
    case A_KUIVA4: return [0,250,0,dm];
    case A_VESI1: return [0,0,150,dm];
    case A_VESI2: return [0,0,200,dm];
    case A_VESI3: return [0,0,250,dm];
    default: return [0,0,0,dm];

  }
}


function luokittele_A_2lk(samples)  {
// ternary operator: TEST ? TRUE : FALSE    
// Tsekattu 20210806, mosaicmod2lk.png
  cl =  (samples.B11 >= 1396) ? (samples.B04 >= 391) ? A_KUIVA1
                : (mndwi12(samples) >= -0.43)? A_KUIVA2
                    : (samples.B12>=1496) ? A_KUIVA3 
                        : A_VESI1
            : (samples.B8A >= 1817) ? (samples.B11 >= 1247) ? A_KUIVA4
                    : A_VESI2
                : A_VESI3;
  if (domasking(samples)>0) {
    cm=0;
  } else {
    cm=255;
  }
    
	return class2rgb(cl,cm);
}

function domasking(samples) {
// Return 1/0 as dataMask!
        CLOUDFREE=[0];
        CLOUD=[1];
        //no-data as cloud for SUMI-case as we need full coverage
        if (samples.dataMask == 0) {
          return CLOUD;
        }
        // First use the 160m mask
        if (samples.CLM) {
          return CLOUD;
        }
        // If 160 m mask is cloudfree, check relevant L2A-flags
     switch (samples.SCL) {
          // No Data (Missing data) (black)    
          case 0: return CLOUD;            
          // Saturated or defective pixel (red)   
          case 1: return CLOUD;        
          // Dark features / Shadows (very dark grey)
          case 2: return CLOUDFREE;            
          // Cloud shadows (dark brown)
          case 3: return CLOUDFREE;            
          // Vegetation (green)
          case 4: return CLOUDFREE;            
          // Not-vegetated (dark yellow)
          case 5: return CLOUDFREE;            
          // Water (dark and bright) (blue)
          case 6: return CLOUDFREE;          
          // Unclassified (dark grey)
          case 7: return CLOUDFREE;          
          // Cloud medium probability (grey)
          case 8: return CLOUD;            
          // Cloud high probability (white)
          case 9: return CLOUD;          
          // Thin cirrus (very bright blue)
          case 10: return CLOUD;            
          // Snow or ice (very bright pink)
          case 11: return CLOUD;        
          // default is cloudfree
          default : return CLOUDFREE;  
        }

}

function evaluatePixel(samples) {
    return {
        default: luokittele_A_2lk(samples)
      };
}


function setup() {
  return {
    input: [{
      bands: [
        "B02",
        "B03",
        "B04",
        "B05",
        "B8A",
        "B11",
        "B12",
        "SCL",
        "CLM",
        "dataMask"
      ],
    units: "DN" 
    }],
    output:
      {
        id: "default",
        bands: 4,
        sampleType: "UINT8"
      }
  };
}
