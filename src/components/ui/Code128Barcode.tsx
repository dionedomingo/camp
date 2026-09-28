import { useId, type FC } from 'react';

interface Code128BarcodeProps {
  value: string;
  width?: number | string;
  height?: number;
  showText?: boolean;
  className?: string;
  barColor?: string;
  textColor?: string;
}

// Code 128 patterns (widths of alternating bars and spaces, 0 to 106)
const CODE128_PATTERNS: string[] = [
  '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213', // 0-9
  '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132', // 10-19
  '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211', // 20-29
  '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313', // 30-39
  '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331', // 40-49
  '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111', // 50-59
  '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214', // 60-69
  '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111', // 70-79
  '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141', // 80-89
  '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141', // 90-99
  '114131', '311141', '411131', '211412', '211214', '211232', '2331112' // 100-106 (106 is STOP with terminating bar '2')
];

export const Code128Barcode: FC<Code128BarcodeProps> = ({
  value,
  width = '100%',
  height = 42,
  showText = true,
  className = '',
  barColor = '#1f1f1f',
  textColor = '#444746',
}) => {
  const uniqueId = useId();

  if (!value || typeof value !== 'string') {
    return null;
  }

  // Sanitize text to Code 128 Subset B range (ASCII 32 to 126)
  const cleanText = value.replace(/[^\x20-\x7E]/g, '');
  if (!cleanText) return null;

  // Start B symbol is 104
  const startCode = 104;
  const symbols: number[] = [startCode];

  let checksumTotal = startCode;

  for (let i = 0; i < cleanText.length; i++) {
    const code = cleanText.charCodeAt(i) - 32;
    symbols.push(code);
    checksumTotal += code * (i + 1);
  }

  const checksum = checksumTotal % 103;
  symbols.push(checksum);
  symbols.push(106); // Stop symbol

  // Build bars sequence (1 = bar, 0 = space)
  const modules: boolean[] = [];

  // Quiet zone: 10 empty modules
  for (let q = 0; q < 10; q++) modules.push(false);

  symbols.forEach((symbolCode, sIdx) => {
    const pattern = CODE128_PATTERNS[symbolCode] || CODE128_PATTERNS[0];
    let isBar = true;

    for (let pIdx = 0; pIdx < pattern.length; pIdx++) {
      const widthUnits = parseInt(pattern[pIdx], 10);
      for (let w = 0; w < widthUnits; w++) {
        modules.push(isBar);
      }
      isBar = !isBar;
    }

    // Stop symbol terminating bar
    if (sIdx === symbols.length - 1 && symbolCode === 106) {
      // 106 has 7 digits in pattern ('2331112'), so terminating bar is already included
    }
  });

  // Ending quiet zone: 10 modules
  for (let q = 0; q < 10; q++) modules.push(false);

  const totalModules = modules.length;

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        id={`barcode-${uniqueId}`}
        viewBox={`0 0 ${totalModules} ${height}`}
        style={{ width, height }}
        preserveAspectRatio="none"
        className="block"
        role="img"
        aria-label={`Barcode for ${cleanText}`}
      >
        {modules.map((isBar, idx) => {
          if (!isBar) return null;
          return (
            <rect
              key={idx}
              x={idx}
              y={0}
              width={1}
              height={height}
              fill={barColor}
              shapeRendering="crispEdges"
            />
          );
        })}
      </svg>
      {showText && (
        <span
          style={{ color: textColor }}
          className="font-mono text-[10px] tracking-wider font-semibold mt-0.5"
        >
          {cleanText}
        </span>
      )}
    </div>
  );
};
