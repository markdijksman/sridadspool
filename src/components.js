import React, { useState } from 'react';
import { FLAGS } from './data';
import { LEGAL_TEXT } from './styles';
import { calcPts } from './data';

export function SriDadsLogo({ size = 40 }) {
  return (
    <svg width={size} height={size * 0.97} viewBox="200 50 1136 980" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink:0 }}>
      <g fill="#ffffff" fillRule="evenodd">
        <path d="M 765 50 L 403 166 L 404 547 L 415 608 L 444 678 L 334 679 L 375 745 L 334 812 L 423 812 L 427 829 L 535 898 L 638 944 L 769 985 L 900 943 L 1000 898 L 1109 828 L 1112 812 L 1201 812 L 1160 746 L 1201 679 L 1090 678 L 1118 615 L 1131 545 L 1132 166 Z"/>
        <path d="M 765 63 L 1120 176 L 1119 550 L 1108 609 L 1087 661 L 1051 715 L 977 775 L 896 815 L 770 858 L 697 837 L 609 802 L 556 774 L 504 736 L 470 698 L 442 649 L 422 589 L 415 537 L 415 176 Z" fill="#0B1F3A"/>
        <path d="M 434 743 L 498 745 L 540 777 L 605 812 L 687 845 L 767 870 L 848 845 L 926 814 L 985 783 L 1036 745 L 1101 743 L 1100 820 L 1029 869 L 957 907 L 871 942 L 767 974 L 668 943 L 601 917 L 525 880 L 460 839 L 435 820 Z" fill="#0B1F3A"/>
        <path d="M 1056 469 L 1018 448 L 967 442 L 914 458 L 877 488 L 852 536 L 848 558 L 850 592 L 755 654 L 852 603 L 861 627 L 810 663 L 865 634 L 881 654 L 791 714 L 888 662 L 913 677 L 848 718 L 926 683 L 967 691 L 910 712 L 777 778 L 995 693 L 1036 673 L 1069 645 L 1090 609 L 1099 557 L 1090 515 L 1076 490 Z"/>
        <path d="M 967 449 L 989 449 L 1009 453 L 1028 460 L 1050 474 L 1068 492 L 1077 505 L 1088 532 L 1092 553 L 1091 580 L 1087 597 L 1076 623 L 1065 639 L 1047 657 L 1026 671 L 1004 680 L 985 684 L 957 684 L 938 680 L 912 669 L 896 658 L 879 641 L 869 626 L 858 599 L 855 583 L 855 555 L 859 536 L 870 510 L 881 494 L 898 477 L 909 469 L 917 465 L 933 462 L 946 453 Z" fill="#0B1F3A"/>
        <path d="M 493 441 L 461 475 L 446 500 L 435 532 L 437 548 L 445 557 L 440 572 L 450 581 L 455 581 L 464 572 L 479 583 L 475 599 L 489 606 L 499 597 L 518 609 L 576 657 L 572 668 L 574 673 L 585 679 L 596 672 L 615 685 L 612 698 L 627 706 L 638 697 L 658 707 L 657 722 L 672 728 L 682 717 L 695 723 L 694 733 L 708 737 L 716 727 L 730 729 L 746 723 L 753 715 L 758 702 L 758 690 L 752 675 L 697 618 L 692 607 L 683 601 L 677 593 L 675 584 L 666 579 L 661 565 L 653 560 L 648 546 L 640 542 L 633 530 L 633 524 L 622 516 L 603 483 L 596 478 L 587 478 L 573 485 L 564 499 L 550 497 L 532 487 L 523 476 L 521 445 L 516 437 L 504 434 Z"/>
        <path d="M 499 444 L 501 445 L 499 477 L 507 494 L 517 503 L 534 510 L 579 509 L 590 513 L 598 521 L 589 523 L 588 531 L 595 532 L 600 529 L 605 531 L 613 542 L 604 548 L 607 554 L 620 552 L 628 563 L 620 568 L 620 572 L 627 574 L 633 571 L 644 584 L 636 589 L 636 593 L 641 596 L 649 592 L 661 607 L 653 611 L 654 616 L 660 618 L 666 615 L 678 629 L 672 632 L 657 629 L 632 603 L 646 621 L 656 630 L 666 634 L 697 627 L 742 672 L 752 692 L 750 707 L 744 715 L 729 717 L 698 709 L 647 687 L 618 671 L 584 646 L 524 588 L 455 530 L 458 525 L 517 574 L 514 558 L 504 535 L 464 483 Z" fill="#0B1F3A"/>
        <path d="M 555 297 L 554 298 L 546 298 L 545 299 L 543 299 L 542 300 L 540 300 L 536 302 L 534 304 L 530 306 L 526 310 L 526 311 L 521 317 L 519 321 L 519 323 L 517 326 L 517 329 L 516 330 L 516 333 L 515 334 L 515 337 L 514 338 L 514 345 L 513 346 L 513 364 L 514 365 L 514 372 L 515 373 L 516 381 L 517 382 L 518 387 L 520 390 L 520 392 L 522 394 L 523 397 L 533 407 L 541 411 L 543 411 L 544 412 L 548 412 L 549 413 L 562 413 L 563 412 L 567 412 L 568 411 L 570 411 L 579 406 L 588 397 L 588 396 L 590 394 L 592 390 L 592 388 L 594 385 L 594 383 L 596 379 L 596 376 L 597 375 L 597 369 L 598 368 L 598 341 L 597 340 L 597 335 L 596 334 L 595 327 L 588 313 L 579 304 L 576 303 L 574 301 L 572 301 L 569 299 L 566 299 L 565 298 L 559 298 L 558 297 Z"/>
        <path d="M 652 297 L 651 298 L 644 298 L 643 299 L 640 299 L 637 301 L 633 302 L 631 304 L 630 304 L 621 313 L 615 324 L 615 326 L 613 330 L 613 333 L 612 334 L 612 338 L 611 339 L 611 348 L 610 349 L 610 360 L 611 361 L 611 370 L 612 371 L 612 376 L 613 377 L 613 380 L 614 381 L 616 389 L 618 393 L 622 398 L 622 399 L 628 405 L 629 405 L 632 408 L 636 410 L 638 410 L 642 412 L 646 412 L 647 413 L 660 413 L 661 412 L 667 411 L 675 407 L 677 405 L 678 405 L 686 396 L 691 386 L 692 380 L 693 379 L 693 376 L 694 375 L 694 371 L 695 370 L 695 360 L 696 359 L 696 349 L 695 348 L 695 338 L 694 337 L 693 330 L 692 329 L 691 324 L 685 313 L 676 304 L 668 300 L 666 300 L 662 298 L 656 298 L 655 297 Z"/>
        <path d="M 787 299 L 786 300 L 786 411 L 831 411 L 832 410 L 836 410 L 837 409 L 839 409 L 845 406 L 853 398 L 856 392 L 856 389 L 857 388 L 857 371 L 856 370 L 855 365 L 854 363 L 848 357 L 840 353 L 846 350 L 849 347 L 854 337 L 854 331 L 855 330 L 855 327 L 854 326 L 854 320 L 853 319 L 852 314 L 844 305 L 843 305 L 841 303 L 839 303 L 836 301 L 833 301 L 832 300 L 825 300 L 824 299 Z"/>
        <path d="M 355 690 L 451 690 L 459 701 L 450 710 L 421 735 L 421 740 L 422 741 L 423 751 L 424 752 L 424 800 L 423 801 L 354 801 L 353 800 L 388 746 L 373 720 L 354 691 Z"/>
        <path d="M 1084 690 L 1180 690 L 1181 691 L 1167 712 L 1166 715 L 1162 720 L 1151 739 L 1147 744 L 1149 750 L 1182 800 L 1181 801 L 1112 801 L 1111 800 L 1111 749 L 1112 748 L 1112 744 L 1114 739 L 1114 735 L 1076 701 L 1081 693 Z"/>
        <path d="M 960 484 L 960 485 L 949 506 L 949 508 L 945 515 L 945 517 L 944 518 L 944 519 L 943 520 L 943 522 L 942 523 L 942 525 L 946 529 L 946 530 L 951 535 L 951 536 L 956 541 L 956 542 L 961 547 L 961 548 L 971 559 L 971 560 L 972 561 L 973 561 L 974 560 L 992 560 L 993 559 L 1011 559 L 1012 558 L 1020 558 L 1021 557 L 1022 554 L 1024 552 L 1024 551 L 1039 522 L 1039 520 L 1040 519 L 1037 515 L 1036 512 L 1034 510 L 1034 509 L 1032 507 L 1032 506 L 1029 503 L 1029 502 L 1026 499 L 1026 498 L 1012 484 L 1011 484 L 1008 481 L 1000 481 L 999 480 L 987 480 L 986 481 L 977 481 L 976 482 L 970 482 L 969 483 L 964 483 L 963 484 Z"/>
        <path d="M 1020 564 L 1014 564 L 1013 565 L 994 565 L 993 566 L 975 566 L 974 567 L 972 567 L 971 568 L 971 569 L 970 570 L 969 573 L 967 575 L 964 582 L 962 584 L 962 585 L 961 586 L 960 589 L 958 591 L 955 598 L 953 600 L 952 603 L 950 605 L 950 606 L 948 609 L 949 610 L 952 617 L 954 619 L 955 622 L 959 627 L 960 630 L 962 632 L 962 633 L 964 635 L 964 636 L 966 638 L 966 639 L 968 641 L 968 642 L 971 645 L 972 645 L 973 646 L 999 646 L 1000 645 L 1006 645 L 1007 644 L 1011 644 L 1012 643 L 1015 643 L 1016 642 L 1016 641 L 1021 636 L 1021 635 L 1024 632 L 1024 631 L 1027 628 L 1027 627 L 1031 622 L 1033 617 L 1035 615 L 1035 614 L 1040 605 L 1040 603 L 1041 602 L 1041 601 L 1040 600 L 1037 593 L 1035 591 L 1031 582 L 1029 580 L 1026 573 L 1024 571 L 1024 570 L 1022 568 L 1022 567 L 1020 565 Z"/>
        <path d="M 896 299 L 895 300 L 893 311 L 890 318 L 890 321 L 888 325 L 888 328 L 886 332 L 884 342 L 881 349 L 880 356 L 878 360 L 878 363 L 876 367 L 876 370 L 874 374 L 874 377 L 872 381 L 870 392 L 868 396 L 868 399 L 867 400 L 866 406 L 864 411 L 886 411 L 889 395 L 890 394 L 890 392 L 892 390 L 924 390 L 925 391 L 925 394 L 926 395 L 926 398 L 927 399 L 927 402 L 928 403 L 928 406 L 930 411 L 951 411 L 950 405 L 947 397 L 947 394 L 945 390 L 943 379 L 941 375 L 941 372 L 940 371 L 939 365 L 937 361 L 936 354 L 935 353 L 934 347 L 932 343 L 931 336 L 929 332 L 929 329 L 927 325 L 927 322 L 926 321 L 925 315 L 923 311 L 923 308 L 921 304 L 921 301 L 920 299 Z"/>
        <path d="M 764 435 L 759 438 L 753 446 L 746 467 L 727 472 L 716 478 L 710 486 L 710 493 L 713 498 L 719 503 L 731 509 L 744 512 L 746 514 L 748 523 L 754 535 L 763 543 L 771 543 L 780 534 L 786 518 L 783 518 L 781 520 L 778 528 L 770 537 L 765 537 L 757 529 L 751 514 L 752 513 L 754 514 L 784 514 L 802 510 L 815 504 L 823 497 L 825 493 L 825 486 L 819 478 L 800 469 L 783 466 L 754 466 L 752 467 L 751 465 L 757 450 L 766 441 L 769 441 L 776 446 L 783 461 L 786 462 L 783 450 L 779 442 L 771 435 Z"/>
        <path d="M 503 299 L 446 299 L 446 411 L 467 411 L 467 369 L 468 368 L 498 368 L 498 347 L 468 347 L 467 346 L 467 321 L 468 320 L 470 321 L 471 320 L 502 320 L 503 321 L 504 320 L 504 300 Z"/>
        <path d="M 740 164 L 726 164 L 718 166 L 708 200 L 707 207 L 704 212 L 686 167 L 664 168 L 669 241 L 683 240 L 681 203 L 680 202 L 680 193 L 681 192 L 687 204 L 699 235 L 702 239 L 703 238 L 710 238 L 712 230 L 721 204 L 721 201 L 726 189 L 727 190 L 727 213 L 728 214 L 728 234 L 729 238 L 730 237 L 743 237 Z"/>
      </g>
    </svg>
  );
}

export function Wordmark() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <SriDadsLogo size={38} />
      <div style={{ lineHeight:1.1 }}>
        <p style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:13, color:"#C9A84C", letterSpacing:"0.8px" }}>SRI DADS</p>
        <p style={{ fontSize:8, color:"rgba(201,168,76,0.55)", letterSpacing:"0.8px", textTransform:"uppercase" }}>Brotherhood beyond the school gates</p>
      </div>
    </div>
  );
}

export function TopBar({ saving }) {
  return (
    <div className="topbar">
      <Wordmark />
      <div style={{ textAlign:"right", lineHeight:1.2 }}>
        <p style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:12, color:"var(--text)" }}>World Cup Pool 2026</p>
        {saving && <p style={{ fontSize:10, color:"var(--muted)" }}>Saving <span className="spin">⚽</span></p>}
      </div>
    </div>
  );
}

export function TeamBadge({ team, right }) {
  const flag = FLAGS[team] || "🏳️";
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontWeight:600, fontSize:12,
      flexDirection: right ? "row-reverse" : "row" }}>
      <span style={{ fontSize:15 }}>{flag}</span>
      <span style={{ whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:76 }}>{team}</span>
    </span>
  );
}

export function Pts({ pts }) {
  if (pts === 3) return <span className="bx-exact">+3 ⭐</span>;
  if (pts === 1) return <span className="bx-ok">+1 ✓</span>;
  return <span className="bx-miss">0</span>;
}

export function Pbar({ value, max }) {
  const w = max > 0 ? (value / max) * 100 : 0;
  return <div className="pbar"><div className="pfill" style={{ width:`${w}%` }} /></div>;
}

export function LegalBox() {
  const [open, setOpen] = useState(false);
  return (
    <div className="legal">
      <p style={{ fontWeight:700, fontSize:12, color:"rgba(201,168,76,0.7)", marginBottom:6, letterSpacing:"0.5px" }}>
        ⚖️ LEGAL NOTICE — UAE COMPLIANCE
      </p>
      <p style={{ marginBottom:8 }}>
        This is a <strong style={{ color:"var(--text)" }}>free-to-play, no-prize, skill-based prediction game</strong>.
        No money changes hands. No financial benefit is gained by any participant.
        This activity does not constitute gambling or wagering under UAE law.
      </p>
      <button onClick={() => setOpen(v => !v)}
        style={{ background:"none", border:"none", color:"var(--gold)", cursor:"pointer",
          fontSize:11, padding:0, fontFamily:"Inter,sans-serif", textDecoration:"underline" }}>
        {open ? "Hide full legal text ▲" : "Read full legal disclaimer ▼"}
      </button>
      {open && <p style={{ marginTop:10, whiteSpace:"pre-line" }}>{LEGAL_TEXT}</p>}
    </div>
  );
}

export function PageFooter() {
  return (
    <div style={{ padding:"20px 16px 108px" }}>
      {/* WhatsApp share button */}
      <a href={`https://wa.me/?text=${encodeURIComponent("⚽ Join our World Cup 2026 Pool!\n\nSign up and predict match scores to compete with the other SRI Dads.\n\n🔗 www.sridads.com\n\nMay the best dad win! 🏆")}`}
        target="_blank" rel="noopener noreferrer"
        style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, background:"#25D366", borderRadius:12, padding:"13px 20px", color:"#fff", fontWeight:700, fontSize:14, textDecoration:"none", boxShadow:"0 4px 16px rgba(37,211,102,0.25)", marginBottom:14 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Share with the Dads on WhatsApp
      </a>
      <LegalBox />
      <div style={{ marginTop:16, borderTop:"1px solid var(--bd)", paddingTop:14, textAlign:"center" }}>
        <p style={{ fontSize:11, color:"var(--muted)", lineHeight:1.8 }}>
          © 2026 SRI Dads · Brotherhood beyond the school gates<br />
          All rights reserved. Made with ⚽ by the SRI parent community.<br />
          <span style={{ fontSize:10, opacity:.6 }}>Not affiliated with GEMS Education or GEMS School of Research &amp; Innovation.</span>
        </p>
      </div>
    </div>
  );
}

export function MatchRow({ match, myPred, onUpdate, showResult }) {
  const pred = myPred || {};
  const filled = pred.homeGoals !== undefined && pred.awayGoals !== undefined;
  const pts = match.result ? calcPts(pred, match.result) : null;
  const locked = !!match.result;
  const isKnockout = !match.group;
  return (
    <div style={{ marginBottom:2 }}>
      {/* Date / time / venue */}
      {(match.date || match.label) && (
        <div style={{ display:"flex", justifyContent:"space-between", padding:"2px 4px 4px", fontSize:10, color:"var(--muted)" }}>
          <span>{match.label || match.date}</span>
          {match.time && <span>🕐 {match.time} Dubai</span>}
          {match.venue && <span style={{ fontSize:9, opacity:.7 }}>{match.venue}</span>}
        </div>
      )}
      <div className={`mrow ${locked ? "played" : ""}`}>
        <div style={{ flex:1, textAlign:"right" }}>
          <TeamBadge team={isKnockout && !FLAGS[match.home] ? "TBD" : match.home} right />
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <input type="number" min="0" max="20"
            className={`sbox ${filled ? "filled" : ""}`}
            value={pred.homeGoals ?? ""}
            disabled={locked || match.home === "TBD" || (isKnockout && !FLAGS[match.home])}
            onChange={e => onUpdate && onUpdate(match.id, e.target.value, pred.awayGoals ?? "")} />
          <span style={{ color:"var(--muted)", fontWeight:700, fontSize:14 }}>–</span>
          <input type="number" min="0" max="20"
            className={`sbox ${filled ? "filled" : ""}`}
            value={pred.awayGoals ?? ""}
            disabled={locked || match.away === "TBD" || (isKnockout && !FLAGS[match.away])}
            onChange={e => onUpdate && onUpdate(match.id, pred.homeGoals ?? "", e.target.value)} />
        </div>
        <div style={{ flex:1 }}>
          <TeamBadge team={isKnockout && !FLAGS[match.away] ? "TBD" : match.away} />
        </div>
        {pts !== null && <Pts pts={pts} />}
        {showResult && match.result && (
          <span style={{ color:"var(--muted)", fontSize:11 }}>{match.result.homeGoals}–{match.result.awayGoals}</span>
        )}
      </div>
    </div>
  );
}

export function AdminMatchRow({ match, onSave }) {
  const [hg, setHg] = useState(match.result?.homeGoals ?? "");
  const [ag, setAg] = useState(match.result?.awayGoals ?? "");
  return (
    <div style={{ marginBottom:2 }}>
      {(match.date || match.label) && (
        <div style={{ display:"flex", justifyContent:"space-between", padding:"2px 4px 4px", fontSize:10, color:"var(--muted)" }}>
          <span>{match.label || match.date}</span>
          {match.time && <span>🕐 {match.time} Dubai</span>}
          {match.venue && <span style={{ fontSize:9, opacity:.7 }}>{match.venue}</span>}
        </div>
      )}
      <div className={`mrow ${match.result ? "played" : ""}`}>
        <div style={{ flex:1, textAlign:"right" }}><TeamBadge team={match.home} right /></div>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <input type="number" min="0" max="20" className={`sbox ${match.result ? "filled" : ""}`}
            value={hg} onChange={e => setHg(e.target.value)} />
          <span style={{ color:"var(--muted)", fontWeight:700 }}>–</span>
          <input type="number" min="0" max="20" className={`sbox ${match.result ? "filled" : ""}`}
            value={ag} onChange={e => setAg(e.target.value)} />
        </div>
        <div style={{ flex:1 }}><TeamBadge team={match.away} /></div>
        <button className="btn btn-gold btn-sm" style={{ flexShrink:0 }}
          onClick={() => { if (hg !== "" && ag !== "") onSave(hg, ag); }}>✓</button>
      </div>
    </div>
  );
}

export function PinGate({ onUnlock, adminPin }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  function tryPin() {
    if (pin === adminPin) { onUnlock(); }
    else { setErr(true); setPin(""); }
  }
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"60px 24px", gap:18 }}>
      <div style={{ width:60, height:60, borderRadius:"50%", background:"var(--gold-pale)",
        border:"2px solid var(--gold-bd)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>🔐</div>
      <p style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:20, color:"var(--text)" }}>Admin Access</p>
      <input type="password" inputMode="numeric" className="pin-inp" maxLength={4}
        value={pin} placeholder="••••"
        onChange={e => { setPin(e.target.value.replace(/\D/g, "")); setErr(false); }}
        onKeyDown={e => e.key === "Enter" && tryPin()} />
      {err && <p style={{ color:"var(--danger)", fontSize:13 }}>Incorrect PIN</p>}
      <button className="btn btn-gold" onClick={tryPin}>Unlock</button>
      <p style={{ color:"var(--muted)", fontSize:11 }}>Default PIN: 1234</p>
    </div>
  );
}
